import * as fs from "fs"
import path = require("path");

export function makeDirectory(pathWithFile: string) {
    if (pathWithFile.trim() === "") {
        return
    }
    var _path = path.dirname(pathWithFile);
    try {
        fs.mkdirSync(_path, {recursive: true})
    } catch (error: any) {
        if(error.code !== 'EEXIST'){
            throw error;
        }    
    }
}

export class Logger {
    private static instance: Logger
    private constructor(){}
    
    isVerbose: boolean = false
    allowDebug: boolean = false

    static getInstance(verbose?: boolean, debug?: boolean): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
            Logger.instance.isVerbose = verbose ?? false
            Logger.instance.allowDebug = debug ?? false
        }
        return Logger.instance
    }

    static verbose(...args: any) {        
        if (Logger.getInstance().isVerbose) {
            console.log.apply(null, [new Date(), "[FileStreamRotator:VERBOSE]", ...args])
        }
    }

    static log(...args: any) {
        console.log.apply(null, [new Date(), "[FileStreamRotator]", ...args])
    }

    static debug(...args: any) {
        if (Logger.getInstance().allowDebug) {
            console.debug.apply(null, [new Date(), "[FileStreamRotator:DEBUG]", ...args])
        }
    }    
}