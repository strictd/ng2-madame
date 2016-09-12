/// <reference types="core-js" />
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
export interface MadameQue {
    query: MadameQuery;
    observer: Observer<any>;
    running?: boolean;
    error?: string;
}
export declare class MadameService {
    serverList: ServerList;
    http: Http;
    authHttp: AuthHttp;
    loginObserv: Observer<any>;
    madameInterval: Observable<any>;
    runningQue: boolean;
    madameCounter: number;
    _que: Observable<any>;
    que: Observer<any>;
    queStash: MadameQue[];
    _needsAuth: Observer<boolean>;
    needsAuth: Observable<any>;
    _runningCount: number;
    _running: Observer<boolean>;
    running: Observable<any>;
    reauthObservable: Observable<any>;
    constructor(_http: Http, _authHttp: AuthHttp);
    setServer(server: string, url: string, host?: string, cookie?: string): void;
    setHost(server: string, host: string, cookie?: string): void;
    setCookie(server: string, cookie: string): void;
    setLoginObserver(observer: Observer<any>): void;
    getAuthHook(): Observable<boolean>;
    getRunningHook(): Observable<boolean>;
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
    queueMadame(query: MadameQuery): any;
    tryQue(que: MadameQue): void;
    rerunQueStash(): void;
    reauthMadame(): void;
    updateRunningCount(by: number): void;
    defaultHeaders(toAdd?: HeaderList): Headers;
    addHeaders(toAdd: HeaderList, cur?: Headers): Headers;
    queryString(obj: any): string;
}
