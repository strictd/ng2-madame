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
var Rx = require('rxjs/Rx');
var MadameSocket = (function () {
    function MadameSocket() {
        this.sockets = {};
        this.initFuncs = [];
        this.serverList = {
            'main': {
                'url': 'http://localhost:3000/',
                'host': document.location.host,
                'cookie': document.cookie
            }
        };
    }
    MadameSocket.prototype.setServer = function (server, url, host, cookie) {
        if (url.trim().slice(-1) !== '/' || url.trim().slice(-1) !== '\\') {
            url += '\\';
        }
        this.serverList[server].url = url;
        if (typeof host !== 'undefined') {
            this.setHost(server, host);
        }
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    };
    MadameSocket.prototype.setHost = function (server, host, cookie) {
        this.serverList[server].host = host;
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    };
    MadameSocket.prototype.setCookie = function (server, cookie) {
        this.serverList[server].cookie = cookie;
    };
    MadameSocket.prototype.getServers = function () {
        return this.serverList;
    };
    MadameSocket.prototype.getServer = function (server) {
        return this.serverList[server];
    };
    MadameSocket.prototype.getURL = function (server) {
        return this.serverList[server].url;
    };
    MadameSocket.prototype.getCookie = function (server) {
        return this.serverList[server].cookie;
    };
    MadameSocket.prototype.getHost = function (server) {
        return this.serverList[server].host;
    };
    MadameSocket.prototype.openSocket = function (server) {
        var _this = this;
        if (server === void 0) { server = 'main'; }
        var _t = this;
        this.sockets[server] = {};
        this.sockets[server].io = io.connect(this.serverList[server].url, {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionAttempts': 10
        });
        this.sockets[server].calls = {};
        var _loop_1 = function(socket) {
            this_1.sockets[socket].connect = Rx.Observable.create(function (observer) {
                var ob = observer;
                _t.sockets[socket].io.on('connect', function () { ob.next(true); });
            });
            this_1.sockets[socket].auth = Rx.Observable.create(function (observer) {
                _t.sockets[socket].io.on('auth', function (data) { observer.next(data); });
            });
            this_1.sockets[socket].connect.subscribe(function () { return _t.sockets[socket].io.emit('authenticate', { host: _this.serverList[server].host, cookie: _this.serverList[server].cookie }); });
            this_1.sockets[socket].auth.subscribe(function (data) { });
            this_1.sockets[socket].io.on('socketReturn', function (cbData) {
                if (typeof cbData === 'undefined' || typeof cbData.socketTag === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag] === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag].callback !== 'undefined') {
                    _t.sockets[socket].calls[cbData.socketTag].callback.apply(_t.sockets[socket], arguments);
                }
                delete _t.sockets[socket].calls[cbData.socketTag];
            });
            this_1.sockets[socket].io.on('socketFail', function (cbData) {
                if (typeof cbData === 'undefined' || typeof cbData.socketTag === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag] === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag].callfail !== 'undefined') {
                    _t.sockets[socket].calls[cbData.socketTag].callfail.apply(_t.sockets[socket], arguments);
                }
                delete _t.sockets[socket].calls[cbData.socketTag];
            });
        };
        var this_1 = this;
        for (var socket in this.sockets) {
            _loop_1(socket);
        }
    };
    MadameSocket.prototype.emit = function (socket, eventName, data, _cb, _cbfail) {
        if (_cb === void 0) { _cb = null; }
        if (_cbfail === void 0) { _cbfail = null; }
        if (typeof data.socketTag === 'undefined') {
            data.socketTag = 'b' + this.s4() + this.s4() + this.s4();
        }
        this.sockets[socket].calls[data.socketTag] = {};
        if (!!_cb) {
            this.sockets[socket].calls[data.socketTag].callback = _cb;
        }
        if (!!_cbfail) {
            this.sockets[socket].calls[data.socketTag].callfail = _cbfail;
        }
        this.sockets[socket].io.emit(eventName, data, function () { alert('Failed To Emit'); });
    };
    MadameSocket.prototype.s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
    MadameSocket = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MadameSocket);
    return MadameSocket;
}());
exports.MadameSocket = MadameSocket;
//# sourceMappingURL=madame-socket.js.map