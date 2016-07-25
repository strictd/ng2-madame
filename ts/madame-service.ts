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
  data: any;
  server?: string;
  headers?: HeaderList;
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

  constructor(_http: Http, _authHttp: AuthHttp) {
    this.http = _http;
    this.authHttp = _authHttp;
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
    if (query.method === 'put') {
      return this.authPut(query.url, query.data, query.server, query.headers);
    } else if (query.method === 'post') {
      return this.authPost(query.url, query.data, query.server, query.headers);
    } else if (query.method === 'delete') {
      return this.authDelete(query.url, query.server);
    } else {
      return this.authGet(query.url, query.server, query.headers);
    }
  }

  tryMadame(query: MadameQuery, loginObserv: Observer<any>) {
    return Observable.create(observer => {
      let authQuery = this.createAuthQueryFromMethod(query);

      authQuery.subscribe(
        resp => {
          if (resp.status === 401) { 
            this.retryMadame(query, loginObserv, observer);
          } else { observer.next(resp.json()); }

        }, err => {
          if (err.status === 401) { 
            this.retryMadame(query, loginObserv, observer);
          } else {
            observer.error(err);
          }
        }
      );
    });
  }
  
  retryMadame(query: MadameQuery, loginObserv: Observer<any>, observer: Observer<any>) {
    Observable.create(observ => {
      loginObserv.next(observ);
    }).subscribe(
      resp => {
        if (resp === true) {
          let retryAuthQuery = this.createAuthQueryFromMethod(query);
          retryAuthQuery.subscribe(
            resp => observer.next(resp.json()),
            err => observer.error(err)
          );
        } else {
          this.retryMadame(query, loginObserv, observer);
        }
      },
      err => observer.error(err)
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
