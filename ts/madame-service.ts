import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

  authGet(url: string, server = 'main'): Observable<Response> {
    return this.authHttp.get(this.getURL(server) + url, {headers: this.defaultHeaders()});
  }
  get(url: string, server = 'main'): Observable<Response> {
    return this.http.get(this.getURL(server) + url, {headers: this.defaultHeaders()});
  }

  authPost(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.authHttp.post(this.getURL(server) + url, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }
  post(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.http.post(this.getURL(server) + url, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }

  authPut(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.authHttp.put(this.getURL(server) + url, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }
  put(url: string, data: Object, server = 'main', headers?: HeaderList): Observable<Response> {
    return this.http.put(this.getURL(server) + url, JSON.stringify(data), {headers: this.defaultHeaders(headers)});
  }

  authDelete(url: string, server = 'main'): Observable<Response> {
    return this.authHttp.delete(this.getURL(server) + url);
  }
  delete(url: string, server = 'main'): Observable<Response> {
    return this.http.delete(this.getURL(server) + url);
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
