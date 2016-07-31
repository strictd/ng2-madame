import { Http, Headers, Response } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';
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
export declare class MadameService {
    serverList: ServerList;
    http: Http;
    authHttp: AuthHttp;
    loginObserv: Observer<any>;
    constructor(_http: Http, _authHttp: AuthHttp);
    setServer(server: string, url: string, host?: string, cookie?: string): void;
    setHost(server: string, host: string, cookie?: string): void;
    setCookie(server: string, cookie: string): void;
    setLoginObserver(observer: Observer<any>): void;
    getServers(): ServerList;
    getServer(server: string): ServerInfo;
    getURL(server: string): string;
    getCookie(server: string): string;
    getHost(server: string): string;
    authGet(url: string, server?: string, headers?: HeaderList): Observable<Response>;
    get(url: string, server?: string, headers?: HeaderList): Observable<Response>;
    authPost(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    post(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    authPut(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    put(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    authDelete(url: string, server?: string, headers?: HeaderList): Observable<Response>;
    delete(url: string, server?: string, headers?: HeaderList): Observable<Response>;
    createAuthQueryFromMethod(query: MadameQuery): Observable<Response>;
    tryMadame(query: MadameQuery): any;
    retryMadame(query: MadameQuery, observer: Observer<any>): void;
    defaultHeaders(toAdd?: HeaderList): Headers;
    addHeaders(toAdd: HeaderList, cur?: Headers): Headers;
    queryString(obj: any): string;
}
