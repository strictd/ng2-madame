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
        this.node = 'http://localhost:3080/';
        this.http = _http;
        this.authHttp = _authHttp;
    }
    MadameService.prototype.authGet = function (url) {
        return this.authHttp.get(this.node + url, { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.get = function (url) {
        return this.http.get(this.node + url, { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.authPost = function (url, data) {
        return this.authHttp.post(this.node + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.post = function (url, data) {
        return this.http.post(this.node + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.authPut = function (url, data) {
        return this.authHttp.put(this.node + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.put = function (url, data) {
        return this.http.put(this.node + url, JSON.stringify(data), { headers: headers_1.contentHeaders });
    };
    MadameService.prototype.authDelete = function (url) {
        return this.authHttp.delete(this.node + url);
    };
    MadameService.prototype.delete = function (url) {
        return this.http.delete(this.node + url);
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