import { OnInit } from '@angular/core';
import { MadameService } from '@strictd/madame/madame-service';
export declare class MadameSocket extends MadameService implements OnInit {
    sockets: any;
    initFuncs: any;
    cookie: string;
    host: string;
    node: string;
    ngOnInit(): void;
    openSocket(server?: string): void;
    emit(socket: string, eventName: string, data: any, _cb?: Function, _cbfail?: Function): void;
    s4(): string;
}
