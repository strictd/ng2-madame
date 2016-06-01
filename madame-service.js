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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var headers_1 = require('./headers');
var angular2_jwt_1 = require('angular2-jwt');
var MadameService = (function () {
    function MadameService(_http, _authHttp) {
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
    MadameService.prototype.setServer = function (server, url, host, cookie) {
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
    };
    MadameService.prototype.setHost = function (server, host, cookie) {
        this.serverList[server].host = host;
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    };
    MadameService.prototype.setCookie = function (server, cookie) {
        this.serverList[server].cookie = cookie;
    };
    MadameService.prototype.getServers = function () {
        return this.serverList;
    };
    MadameService.prototype.getServer = function (server) {
        return this.serverList[server];
    };
    MadameService.prototype.getURL = function (server) {
        return this.serverList[server].url;
    };
    MadameService.prototype.getCookie = function (server) {
        return this.serverList[server].cookie;
    };
    MadameService.prototype.getHost = function (server) {
        return this.serverList[server].host;
    };
    MadameService.prototype.authGet = function (url, server) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.get(this.getURL(server) + url, { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.get = function (url, server) {
        if (server === void 0) { server = 'main'; }
        return this.http.get(this.getURL(server) + url, { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.authPost = function (url, data, server) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.post(this.getURL(server) + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.post = function (url, data, server) {
        if (server === void 0) { server = 'main'; }
        return this.http.post(this.getURL(server) + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.authPut = function (url, data, server) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.put(this.getURL(server) + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.put = function (url, data, server) {
        if (server === void 0) { server = 'main'; }
        return this.http.put(this.getURL(server) + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.authDelete = function (url, server) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.delete(this.getURL(server) + url);
    };
    MadameService.prototype.delete = function (url, server) {
        if (server === void 0) { server = 'main'; }
        return this.http.delete(this.getURL(server) + url);
    };
    MadameService.prototype.queryString = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p].toString()));
            }
        }
        return str.join('&');
    };
    MadameService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, angular2_jwt_1.AuthHttp])
    ], MadameService);
    return MadameService;
}());
exports.MadameService = MadameService;
//# sourceMappingURL=madame-service.js.map