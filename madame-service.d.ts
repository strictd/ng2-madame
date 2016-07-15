import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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
export declare class MadameService {
    serverList: ServerList;
    http: Http;
    authHttp: AuthHttp;
    constructor(_http: Http, _authHttp: AuthHttp);
    setServer(server: string, url: string, host?: string, cookie?: string): void;
    setHost(server: string, host: string, cookie?: string): void;
    setCookie(server: string, cookie: string): void;
    getServers(): ServerList;
    getServer(server: string): ServerInfo;
    getURL(server: string): string;
    getCookie(server: string): string;
    getHost(server: string): string;
    authGet(url: string, server?: string): Observable<Response>;
    get(url: string, server?: string): Observable<Response>;
    authPost(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    post(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    authPut(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    put(url: string, data: Object, server?: string, headers?: HeaderList): Observable<Response>;
    authDelete(url: string, server?: string): Observable<Response>;
    delete(url: string, server?: string): Observable<Response>;
    defaultHeaders(toAdd?: HeaderList): Headers;
    addHeaders(toAdd: HeaderList, cur?: Headers): Headers;
    queryString(obj: any): string;
}
