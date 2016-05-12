"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var madame_service_1 = require('@strictd/madame/madame-service');
var MadameSocket = (function (_super) {
    __extends(MadameSocket, _super);
    function MadameSocket() {
        _super.apply(this, arguments);
        this.sockets = {};
        this.initFuncs = [];
        this.cookie = document.cookie;
        this.host = document.location.host;
        this.node = MADAME_SOCKET_ENDPOINT;
    }
    MadameSocket.prototype.ngOnInit = function () {
        if (!this.node) {
            alert('Must define MADAME_SOCKET_ENDPOINT in the global scope to Madame Sockets to work!');
        }
    };
    MadameSocket.prototype.openSocket = function (server) {
        var _this = this;
        if (server === void 0) { server = 'main'; }
        var _t = this;
        this.sockets[server] = {};
        this.sockets[server].io = io.connect(this.node, {
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
            console.log('load socket: ', socket);
            this_1.sockets[socket].connect.subscribe(function () { return _t.sockets[socket].io.emit('authenticate', { host: _this.host, cookie: _this.cookie }); });
            this_1.sockets[socket].auth.subscribe(function (data) { return console.log(data); });
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
}(madame_service_1.MadameService));
exports.MadameSocket = MadameSocket;
//# sourceMappingURL=madame-socket.js.map