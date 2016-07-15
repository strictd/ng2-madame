"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const http_1 = require('@angular/http');
const angular2_jwt_1 = require('angular2-jwt');
let MadameService = class MadameService {
    constructor(_http, _authHttp) {
        this.serverList = {
            'main': {
                'url': 'http://localhost:3000/',
                'host': document.location.host,
                'cookie': document.cookie
            }
        };
        this.http = _http;
        this.authHttp = _authHttp;
    }
    setServer(server, url, host, cookie) {
        if (url.trim().slice(-1) === '\\') {
            url = url.substring(0, url.length - 1);
        }
        if (url.trim().slice(-1) !== '/') {
            url += '/';
        }
        this.serverList[server].url = url;
        if (typeof host !== 'undefined') {
            this.setHost(server, host);
        }
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    }
    setHost(server, host, cookie) {
        this.serverList[server].host = host;
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    }
    setCookie(server, cookie) {
        this.serverList[server].cookie = cookie;
    }
    getServers() {
        return this.serverList;
    }
    getServer(server) {
        return this.serverList[server];
    }
    getURL(server) {
        return this.serverList[server].url;
    }
    getCookie(server) {
        return this.serverList[server].cookie;
    }
    getHost(server) {
        return this.serverList[server].host;
    }
    authGet(url, server = 'main') {
        return this.authHttp.get(this.getURL(server) + url, { headers: this.defaultHeaders() });
    }
    get(url, server = 'main') {
        return this.http.get(this.getURL(server) + url, { headers: this.defaultHeaders() });
    }
    authPost(url, data, server = 'main', headers) {
        return this.authHttp.post(this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    post(url, data, server = 'main', headers) {
        return this.http.post(this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    authPut(url, data, server = 'main', headers) {
        return this.authHttp.put(this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    put(url, data, server = 'main', headers) {
        return this.http.put(this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    authDelete(url, server = 'main') {
        return this.authHttp.delete(this.getURL(server) + url);
    }
    delete(url, server = 'main') {
        return this.http.delete(this.getURL(server) + url);
    }
    defaultHeaders(toAdd) {
        let headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        if (toAdd)
            headers = this.addHeaders(toAdd, headers);
        return headers;
    }
    addHeaders(toAdd, cur) {
        if (!cur)
            cur = new http_1.Headers();
        for (let h in toAdd) {
            cur.append(toAdd[h].key, toAdd[h].val);
        }
        return cur;
    }
    queryString(obj) {
        let str = [];
        for (let p in obj) {
            if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p].toString()));
            }
        }
        return str.join('&');
    }
};
MadameService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp])
], MadameService);
exports.MadameService = MadameService;
//# sourceMappingURL=madame-service.js.map