/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "node:stream";
import type { FileStreamRotatorOptions, FileStreamRotatorConfig } from "./types";
import Rotator from "./Rotator";
export default class FileStreamRotator extends EventEmitter {
    static getStream(options: Partial<FileStreamRotatorOptions>): FileStreamRotator;
    private config;
    private fs?;
    private rotator;
    private currentFile?;
    private auditManager;
    constructor(options: Partial<FileStreamRotatorOptions>);
    private parseOptions;
    rotate(): void;
    private createNewLog;
    write(str: string, encoding?: BufferEncoding): void;
    end(str: string): void;
    private bubbleEvents;
    private createCurrentSymLink;
    test(): {
        config: FileStreamRotatorConfig;
        rotator: Rotator;
    };
}
