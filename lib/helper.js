"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.makeDirectory = void 0;
const fs = require("fs");
const path = require("path");
function makeDirectory(pathWithFile) {
    if (pathWithFile.trim() === "") {
        return;
    }
    var _path = path.dirname(pathWithFile);
    try {
        fs.mkdirSync(_path, { recursive: true });
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}
exports.makeDirectory = makeDirectory;
class Logger {
    constructor() {
        this.isVerbose = false;
        this.allowDebug = false;
    }
    static getInstance(verbose, debug) {
        if (!Logger.instance) {
            Logger.instance = new Logger();
            Logger.instance.isVerbose = verbose !== null && verbose !== void 0 ? verbose : false;
            Logger.instance.allowDebug = debug !== null && debug !== void 0 ? debug : false;
        }
        return Logger.instance;
    }
    static verbose(...args) {
        if (Logger.getInstance().isVerbose) {
            console.log.apply(null, [new Date(), "[FileStreamRotator:VERBOSE]", ...args]);
        }
    }
    static log(...args) {
        console.log.apply(null, [new Date(), "[FileStreamRotator]", ...args]);
    }
    static debug(...args) {
        if (Logger.getInstance().allowDebug) {
            console.debug.apply(null, [new Date(), "[FileStreamRotator:DEBUG]", ...args]);
        }
    }
}
exports.Logger = Logger;
