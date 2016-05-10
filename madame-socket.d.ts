import { MadameService } from './madame-service';
export declare class MadameSocket extends MadameService {
    sockets: any;
    initFuncs: any;
    cookie: string;
    host: string;
    node: string;
    openSocket(server?: string): void;
    emit(socket: string, eventName: string, data: any, _cb?: Function, _cbfail?: Function): void;
    s4(): string;
}
