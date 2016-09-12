/// <reference types="core-js" />
import { MadameService, ServerList, ServerInfo } from './madame-service';
export declare class MadameSocket extends MadameService {
    sockets: any;
    initFuncs: any;
    serverList: ServerList;
    setServer(server: string, url: string, host?: string, cookie?: string): void;
    setHost(server: string, host: string, cookie?: string): void;
    setCookie(server: string, cookie: string): void;
    getServers(): ServerList;
    getServer(server: string): ServerInfo;
    getURL(server: string): string;
    getCookie(server: string): string;
    getHost(server: string): string;
    openSocket(server?: string, jwt?: string): void;
    emit(socket: string, eventName: string, data: any, _cb?: Function, _cbfail?: Function): void;
    s4(): string;
}
