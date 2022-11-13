export declare function makeDirectory(pathWithFile: string): void;
export declare class Logger {
    private static instance;
    private constructor();
    isVerbose: boolean;
    allowDebug: boolean;
    static getInstance(verbose?: boolean, debug?: boolean): Logger;
    static verbose(...args: any): void;
    static log(...args: any): void;
    static debug(...args: any): void;
}
