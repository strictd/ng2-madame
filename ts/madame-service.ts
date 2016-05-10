import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { contentHeaders } from './headers';
import { AuthHttp } from 'angular2-jwt';

declare var io: any;

@Injectable()
export class MadameService {

  // public node: string = 'http://node.strictd.com:3000/';
  public node: string = 'http://localhost:3080/';

  http: Http;
  authHttp: AuthHttp;

  constructor(_http: Http, _authHttp: AuthHttp) {
    this.http = _http;
    this.authHttp = _authHttp;
  }

  authGet(url: string): Observable<Response> {
    return this.authHttp.get(this.node + url, {headers: contentHeaders});
  }
  get(url: string): Observable<Response> {
    return this.http.get(this.node + url, {headers: contentHeaders});
  }

  authPost(url: string, data: Object): Observable<Response> {
    return this.authHttp.post(this.node + url, JSON.stringify(data), {headers: contentHeaders});
  }
  post(url: string, data: Object): Observable<Response> {
    return this.http.post(this.node + url, JSON.stringify(data), {headers: contentHeaders});
  }

  authPut(url: string, data: Object): Observable<Response> {
    return this.authHttp.put(this.node + url, JSON.stringify(data), {headers: contentHeaders});
  }
  put(url: string, data: Object): Observable<Response> {
    return this.http.put(this.node + url, JSON.stringify(data), {headers: contentHeaders});
  }

  authDelete(url: string): Observable<Response> {
    return this.authHttp.delete(this.node + url);
  }
  delete(url: string): Observable<Response> {
    return this.http.delete(this.node + url);
  }

  queryString(obj: any[]|any): string {
    let str: any[] = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p].toString()));
      }
    }
    return str.join('&');
  }
}
