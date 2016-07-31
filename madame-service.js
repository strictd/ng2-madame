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
var rxjs_1 = require('rxjs');
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
    MadameService.prototype.setLoginObserver = function (observer) {
        this.loginObserv = observer;
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
    MadameService.prototype.authGet = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.get("" + this.getURL(server) + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.get = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.http.get("" + this.getURL(server) + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authPost = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.post("" + this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.post = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.http.post("" + this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authPut = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.put("" + this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.put = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.http.put("" + this.getURL(server) + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authDelete = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.authHttp.delete("" + this.getURL(server) + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.delete = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        return this.http.delete("" + this.getURL(server) + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.createAuthQueryFromMethod = function (query) {
        var url = query.url;
        if (!!query.query_string && Object.keys(query.query_string).length) {
            url = url + "?" + this.queryString(query.query_string);
        }
        if (query.method === 'put') {
            return this.authPut(url, query.data, query.server, query.headers);
        }
        else if (query.method === 'post') {
            return this.authPost(url, query.data, query.server, query.headers);
        }
        else if (query.method === 'delete') {
            return this.authDelete(url, query.server);
        }
        else {
            return this.authGet(url, query.server, query.headers);
        }
    };
    MadameService.prototype.tryMadame = function (query) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var authQuery = _this.createAuthQueryFromMethod(query);
            authQuery.subscribe(function (resp) {
                if (resp.status === 401) {
                    _this.retryMadame(query, observer);
                }
                else {
                    observer.next(resp);
                }
            }, function (err) {
                if (err.status === 401) {
                    _this.retryMadame(query, observer);
                }
                else {
                    observer.error(err);
                }
            });
        });
    };
    MadameService.prototype.retryMadame = function (query, observer) {
        var _this = this;
        rxjs_1.Observable.create(function (observ) {
            _this.loginObserv.next(observ);
        }).subscribe(function (resp) {
            if (resp === true) {
                var retryAuthQuery = _this.createAuthQueryFromMethod(query);
                retryAuthQuery.subscribe(function (resp) { return observer.next(resp); }, function (err) { return observer.error(err); });
            }
            else {
                _this.retryMadame(query, observer);
            }
        }, function (err) { return observer.error(err); });
    };
    MadameService.prototype.defaultHeaders = function (toAdd) {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        if (toAdd)
            headers = this.addHeaders(toAdd, headers);
        return headers;
    };
    MadameService.prototype.addHeaders = function (toAdd, cur) {
        if (!cur)
            cur = new http_1.Headers();
        for (var h in toAdd) {
            cur.append(toAdd[h].key, toAdd[h].val);
        }
        return cur;
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