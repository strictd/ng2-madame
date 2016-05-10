import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
export declare class MadameService {
    node: string;
    http: Http;
    authHttp: AuthHttp;
    constructor(_http: Http, _authHttp: AuthHttp);
    authGet(url: string): Observable<Response>;
    get(url: string): Observable<Response>;
    authPost(url: string, data: Object): Observable<Response>;
    post(url: string, data: Object): Observable<Response>;
    authPut(url: string, data: Object): Observable<Response>;
    put(url: string, data: Object): Observable<Response>;
    authDelete(url: string): Observable<Response>;
    delete(url: string): Observable<Response>;
    queryString(obj: any): string;
}
