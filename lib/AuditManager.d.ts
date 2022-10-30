/// <reference types="node" />
import { AuditSettings } from "./types";
import { EventEmitter } from "stream";
export default class AuditManager {
    config: AuditSettings;
    emitter: EventEmitter;
    constructor(config: AuditSettings, emitter: EventEmitter);
    private loadLog;
    private writeLog;
    addLog(name: string): void;
    private removeLog;
}
