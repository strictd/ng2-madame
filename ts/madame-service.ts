import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { contentHeaders } from './headers';
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
    if (url.trim().slice(-1) !== '/' || url.trim().slice(-1) !== '\\') { url += '\\'; }  

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
    return this.authHttp.get(this.getURL(server) + url, {headers: contentHeaders});
  }
  get(url: string, server = 'main'): Observable<Response> {
    return this.http.get(this.getURL(server) + url, {headers: contentHeaders});
  }

  authPost(url: string, data: Object, server = 'main'): Observable<Response> {
    return this.authHttp.post(this.getURL(server) + url, JSON.stringify(data), {headers: contentHeaders});
  }
  post(url: string, data: Object, server = 'main'): Observable<Response> {
    return this.http.post(this.getURL(server) + url, JSON.stringify(data), {headers: contentHeaders});
  }

  authPut(url: string, data: Object, server = 'main'): Observable<Response> {
    return this.authHttp.put(this.getURL(server) + url, JSON.stringify(data), {headers: contentHeaders});
  }
  put(url: string, data: Object, server = 'main'): Observable<Response> {
    return this.http.put(this.getURL(server) + url, JSON.stringify(data), {headers: contentHeaders});
  }

  authDelete(url: string, server = 'main'): Observable<Response> {
    return this.authHttp.delete(this.getURL(server) + url);
  }
  delete(url: string, server = 'main'): Observable<Response> {
    return this.http.delete(this.getURL(server) + url);
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
