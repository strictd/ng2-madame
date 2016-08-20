import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';

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
  observer: Observer<any>
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

  _que: Observable<any>;
  que: Observer<any>;
  queStash: MadameQue[] = [];

  constructor(_http: Http, _authHttp: AuthHttp) {
    this.http = _http;
    this.authHttp = _authHttp;

    this._que = new Observable(observer => {
      this.que = observer; // Assign to static App._loggedInObserver
    }).share();

    this._que.subscribe((que: MadameQue) => {
      this.tryQue(que);
    });
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

  setLoginObserver(observer: Observer<any>) {
    this.loginObserv = observer;
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

  tryMadame(query: MadameQuery) {
    return this.queueMadame(query);
  }
  queueMadame(query: MadameQuery) {
    return Observable.create(observer => {
      let userQue = <MadameQue>{
        query: query,
        observer: observer
      };
      this.que.next(userQue);
    });
  }

  tryQue(que: MadameQue) {
    let authQuery = this.createAuthQueryFromMethod(que.query);

    authQuery.subscribe(
      resp => {
        if (resp.status === 401) {
          this.queStash.push(que);
          if (!this.reauthObservable) { this.reauthMadame(); }
        } else {
          que.observer.next(resp);
          que.observer.complete();
        }

      }, err => {
        if (err.status === 401) {
          this.queStash.push(que);
          if (!this.reauthObservable) { this.reauthMadame(); }
        } else {
          que.observer.error(err);
          que.observer.complete();
        }
      }
    );
  }

  rerunQueStash() {
    this.reauthObservable = null;
    let myQueStash = Object.assign({}, this.queStash);
    //this.queStash = [];

    do {
      let q = this.queStash.shift();
      this.tryQue(q);
    } while (this.queStash !== void 0 && this.queStash.length);
  }

  reauthObservable: Observable<any>;
  reauthMadame() {
    this.reauthObservable = Observable.create(observ => {
      this.loginObserv.next(observ);
    });

    this.reauthObservable.subscribe(
      resp => {},
      err => {
        this.reauthMadame();
      },
      () => this.rerunQueStash()
    );
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
