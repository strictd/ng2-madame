import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Observer, Subscription } from 'rxjs';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

declare var io: any;

export interface ServerInfo {
  url: string;
  host?: string;
  cookie?: string;
}
export interface ServerList {
  [index: string]: ServerInfo;
}

export interface HeaderInfo {
  key: string;
  val: string;
}
export interface HeaderList {
  [index: string]: HeaderInfo;
}

export interface MadameQuery {
  method: string;
  url: string;
  data?: any;
  query_string?: any;
  server?: string;
  headers?: HeaderList;
}

export interface MadameQue {
  query: MadameQuery,
  observer: Observer<any>,
  running?: boolean,
  error?: string
}

@Injectable()
export class MadameService {
  serverList: ServerList = {
    'main': {
      'url': 'http://localhost:3000/',
      'host': document.location.host,
      'cookie': document.cookie
    }
  };

  http: Http;
  authHttp: AuthHttp;

  loginObserv: Observer<any>;

  madameInterval: Observable<any>;
  runningQue = false;
  madameCounter = 0;

  _que: Observable<any>;
  que: Observer<any>;
  queStash: MadameQue[] = [];
  _needsAuth: Observer<boolean>;
  needsAuth: Observable<any>;
  _runningCount: number = 0;
  _running: Observer<boolean>;
  running: Observable<any>;

  constructor(_http: Http, _authHttp: AuthHttp) {
    this.http = _http;
    this.authHttp = _authHttp;

    this._que = new Observable(observer => {
      this.que = observer;
    }).share();

    this._que.subscribe((que: MadameQue) => {
      this.tryQue(que);
    });

    this.needsAuth = new Observable(observer => {
      this._needsAuth = observer;
    });

    this.running = new Observable(observer => {
      this._running = observer;
    })

  }


  setServer(server: string, url: string, host?: string, cookie?: string): void {
    if (url.trim().slice(-1) === '\\') { url = url.substring(0, url.length - 1); }
    if (url.trim().slice(-1) !== '/') { url += '/'; }

    this.serverList[server].url = url;
    if (typeof host !== 'undefined') { this.setHost(server, host); }
    if (typeof cookie !== 'undefined') { this.setCookie(server, cookie); }
  }
  setHost(server: string, host: string, cookie?: string): void {
    this.serverList[server].host = host;
    if (typeof cookie !== 'undefined') { this.setCookie(server, cookie); }
  }
  setCookie(server: string, cookie: string): void {
    this.serverList[server].cookie = cookie;
  }

  setLoginObserver(observer: Observer<any>): void {
    this.loginObserv = observer;
  }

  getAuthHook(): Observable<boolean> {
    return this.needsAuth;
  }

  getRunningHook(): Observable<boolean> {
    return this.running;
  }

  getServers(): ServerList {
    return this.serverList;
  }
  getServer(server: string): ServerInfo {
    return this.serverList[server];
  }
  getURL(server: string): string {
    return this.serverList[server].url;
  }
  getCookie(server: string): string {
    return this.serverList[server].cookie;
  }
  getHost(server: string): string {
    return this.serverList[server].host;
  }

  authGet(url: string, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.authHttp.get(`${this.getURL(server)}${url}`, {headers: this.defaultHeaders(headers)});
  }
  get(url: string, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.http.get(`${this.getURL(server)}${url}`, {headers: this.defaultHeaders(headers)});
  }

  authPost(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.authHttp.post(`${this.getURL(server)}${url}`, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }
  post(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.http.post(`${this.getURL(server)}${url}`, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }

  authPut(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.authHttp.put(`${this.getURL(server)}${url}`, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }
  put(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.http.put(`${this.getURL(server)}${url}`, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }

  authDelete(url: string, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.authHttp.delete(`${this.getURL(server)}${url}`, {headers: this.defaultHeaders(headers)});
  }
  delete(url: string, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.http.delete(`${this.getURL(server)}${url}`, {headers: this.defaultHeaders(headers)});
  }


  createAuthQueryFromMethod(query: MadameQuery): Observable<Response> {
    let url = query.url;
    if (!!query.query_string && Object.keys(query.query_string).length) {
      url = `${url}?${this.queryString(query.query_string)}`;
    }

    if (query.method === 'put') {
      return this.authPut(url, query.data, query.server, query.headers);
    } else if (query.method === 'post') {
      return this.authPost(url, query.data, query.server, query.headers);
    } else if (query.method === 'delete') {
      return this.authDelete(url, query.server);
    } else {
      return this.authGet(url, query.server, query.headers);
    }
  }

  queueMadame(query: MadameQuery) {
    return Observable.create(observer => {
      let userQue = <MadameQue>{
        query: query,
        observer: observer
      };
      // if (tokenNotExpired('jwt')) {
        this.que.next(userQue);
      // } else {
      //   this.queStash.push(userQue);
      //   this.reauthMadame();
      // }
    });
  }

  tryQue(que: MadameQue) {
    let authQuery = this.createAuthQueryFromMethod(que.query);
    que.running = true;
    this.updateRunningCount(1);

    authQuery.subscribe(
      resp => {
        if (resp.status === 401) {
          que.error = "401";
          this.queStash.unshift(que);
          this.reauthMadame();
        } else {
          que.observer.next(resp);
          que.observer.complete();
        }

        que.running = false;
        this.updateRunningCount(-1);
      }, err => {
        if (err.status === 401) {
          que.error = "401";
          this.queStash.unshift(que);
          this.reauthMadame();
        } else {
          que.error = err;
          que.observer.error(err);
          que.observer.complete();
        }

        que.running = false;
        this.updateRunningCount(-1);
      }
    );
  }

  rerunQueStash() {
    this.reauthObservable = null;
    if (!this.queStash.length) { return; }

    do {
      let q = this.queStash.shift();
      this.tryQue(q);
    } while (!this.reauthObservable && this.queStash !== void 0 && this.queStash.length);
  }

  reauthObservable: Observable<any>;
  reauthMadame() {
    if (this.reauthObservable) { return; }

    this.reauthObservable = Observable.create(observ => {
      this.loginObserv.next(observ);
    });

    this.reauthObservable.subscribe(
      resp => {
        if (resp === true) {
          this._needsAuth.next(false);
          this.rerunQueStash();
        } else {
          this._needsAuth.next(true);
        }
      },
      err => {
        this.reauthMadame();
      },
      () => {
        this.reauthObservable = null;
      }
    );
  }

  updateRunningCount(by: number) {
    this._runningCount += by;
    if (this._runningCount === 1) { this._running.next(true); }
    else if (this._runningCount === 0) { this._running.next(false); }
  }





  defaultHeaders(toAdd?: HeaderList): Headers {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    if (toAdd) headers = this.addHeaders(toAdd, headers);
  return headers;
  }
  addHeaders(toAdd: HeaderList, cur?: Headers ): Headers {
    if (!cur) cur = new Headers();

    for (let h in toAdd) {
      cur.append(toAdd[h].key, toAdd[h].val);
    }
    return cur;
  }
  queryString(obj: any): string {
    let str: any[] = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p].toString()));
      }
    }
    return str.join('&');
  }
}
