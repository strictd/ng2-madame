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
const Rx = require('rxjs/Rx');
const madame_service_1 = require('./madame-service');
let MadameSocket = class MadameSocket extends madame_service_1.MadameService {
    constructor(...args) {
        super(...args);
        this.sockets = {};
        this.initFuncs = [];
        this.serverList = {
            'main': {
                'url': 'http://localhost:3000',
                'host': document.location.host,
                'cookie': document.cookie
            }
        };
    }
    setServer(server, url, host, cookie) {
        if (url.trim().slice(-1) == '/' || url.trim().slice(-1) === '\\') {
            url = url.substring(0, url.length - 1);
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
    openSocket(server = 'main', jwt) {
        let _t = this;
        this.sockets[server] = {};
        this.sockets[server].io = io.connect(this.serverList[server].url, {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionAttempts': 10
        });
        this.sockets[server].calls = {};
        for (let socket in this.sockets) {
            this.sockets[socket].connect = Rx.Observable.create(function (observer) {
                let ob = observer;
                _t.sockets[socket].io.on('connect', function () { ob.next(true); });
            });
            this.sockets[socket].auth = Rx.Observable.create(function (observer) {
                _t.sockets[socket].io.on('auth', function (data) { observer.next(data); });
            });
            this.sockets[socket].connect.subscribe(() => {
                _t.sockets[socket].io.on('authenticated', function () {
                })
                    .emit('authenticate', { token: jwt });
            });
            this.sockets[socket].auth.subscribe((data) => {
                console.log('We have authed');
            });
            this.sockets[socket].io.on('socketReturn', function (cbData) {
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
            this.sockets[socket].io.on('socketFail', function (cbData) {
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
        }
    }
    emit(socket, eventName, data, _cb = null, _cbfail = null) {
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
    }
    s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
};
MadameSocket = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], MadameSocket);
exports.MadameSocket = MadameSocket;
//# sourceMappingURL=madame-socket.js.map