import { Injectable, OnInit } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { MadameService } from '@strictd/madame/madame-service';

declare const io: any;
declare var MADAME_SOCKET_ENDPOINT: string;

@Injectable()
export class MadameSocket extends MadameService implements OnInit {
  public sockets: any = {};
  public initFuncs: any = [];

  public cookie: string = document.cookie;
  //  public host: string = 'intranet.usautosales.com';
  public host: string = document.location.host;
  //  public node: string = document.location.protocol+'//'+document.location.host+':8000'; //
  //  public node: string = document.location.protocol+'//192.168.0.8:8000';
  //  public node: string = '192.168.0.8:8000';
  public node: string = MADAME_SOCKET_ENDPOINT;

  ngOnInit() {
    if (!this.node) { alert('Must define MADAME_SOCKET_ENDPOINT in the global scope to Madame Sockets to work!'); }
  }

  openSocket(server = 'main') {
    let _t = this;

    this.sockets[server] = {};
    this.sockets[server].io = io.connect(this.node, {
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionAttempts': 10
    });
    this.sockets[server].calls = {};


    for (let socket in this.sockets) {
      this.sockets[socket].connect = Rx.Observable.create(function(observer: Observer<any>) {
        let ob = observer;
        _t.sockets[socket].io.on('connect', function() { ob.next(true); });
      });

      this.sockets[socket].auth = Rx.Observable.create(function(observer: Observer<any>) {
        _t.sockets[socket].io.on('auth', function(data: any) { observer.next(data); });
      });



      console.log('load socket: ', socket);
      this.sockets[socket].connect.subscribe(() => _t.sockets[socket].io.emit('authenticate', {host: this.host, cookie: this.cookie }));
      this.sockets[socket].auth.subscribe((data: any) => console.log(data));


/*
      this.sockets[socket].io.on('authfail', function() {
        console.log('Authentication Failure');
      });
      this.sockets[socket].io.on('connect_error', function(data) {
        console.log('Connect Error', arguments);
      });

      this.sockets[socket].io.on('connect_timeout', function() {
        console.log('Connect Timeout', arguments)
      });
      this.sockets[socket].io.on('reconnect', function(data) {
        console.log('Reconnect', arguments);
      });
      this.sockets[socket].io.on('reconnect_attempt', function() {
        console.log('Reconnect Attempt', arguments);
      });
      this.sockets[socket].io.on('reconnect_error', function(data) {
        console.log('Reconnect Error', arguments);
      });
      this.sockets[socket].io.on('reconnect_failed', function() {
        console.log('Reconnect Failed', arguments);
      });

      this.sockets[socket].io.on('error', function() {
        console.log('Error', arguments);
      });
      this.sockets[socket].io.on('connect', function() {
        console.log('Connect', arguments);
      });
      this.sockets[socket].io.on('disconnect', function() {
        console.log('Disconnect', arguments);
      });
*/
      this.sockets[socket].io.on('socketReturn', function(cbData: any) {
        // console.log('Return Socket', _t.sockets[socket].calls, cbData);
        if (typeof cbData === 'undefined' || typeof cbData.socketTag === 'undefined') { return; }
        if (typeof _t.sockets[socket].calls[cbData.socketTag] === 'undefined') { return; }
        if (typeof _t.sockets[socket].calls[cbData.socketTag].callback !== 'undefined') { _t.sockets[socket].calls[cbData.socketTag].callback.apply(_t.sockets[socket], arguments); }
        delete _t.sockets[socket].calls[cbData.socketTag];
      });
      this.sockets[socket].io.on('socketFail', function(cbData: any) {
        if (typeof cbData === 'undefined' || typeof cbData.socketTag === 'undefined') { return; }
        if (typeof _t.sockets[socket].calls[cbData.socketTag] === 'undefined') { return; }
        if (typeof _t.sockets[socket].calls[cbData.socketTag].callfail !== 'undefined') { _t.sockets[socket].calls[cbData.socketTag].callfail.apply(_t.sockets[socket], arguments); }
        delete _t.sockets[socket].calls[cbData.socketTag];
      });
    }

  }

  emit(socket: string, eventName: string, data: any, _cb: Function = null, _cbfail: Function = null) {
    if (typeof data.socketTag === 'undefined') { data.socketTag = 'b' + this.s4() + this.s4() + this.s4(); }
    this.sockets[socket].calls[data.socketTag] = {};
    if (!!_cb) { this.sockets[socket].calls[data.socketTag].callback = _cb; }
    if (!!_cbfail) { this.sockets[socket].calls[data.socketTag].callfail = _cbfail; }
    this.sockets[socket].io.emit(eventName, data, function () { alert('Failed To Emit'); });
  }
//  on() { }
//  removeAllListeners() { }

  s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }

}
