import * as fs from "fs";
import path = require("path");
import { KeepLogFiles } from "./enums";
import { Logger, makeDirectory } from "./helper";
import { AuditConfigFile, AuditEntry, AuditSettings } from "./types";
import * as crypto from "crypto"
import { EventEmitter } from "stream";

export default class AuditManager {

    config: AuditSettings
    emitter: EventEmitter

    constructor(config: AuditSettings, emitter: EventEmitter){
        this.config = config
        this.emitter = emitter
        this.loadLog()
    }

    private loadLog() {
        if (!this.config.keepSettings || this.config.keepSettings?.amount == 0 || !this.config.auditFilename || this.config.auditFilename == "") {
            Logger.verbose("no existing audit settings found", this.config)
            return
        }
        // Logger.debug("loaded audit settings", this.config)

        try{
            let full_path = path.resolve(this.config.auditFilename);
            let savedFile: AuditConfigFile = JSON.parse(fs.readFileSync(full_path, { encoding: 'utf-8' }));
            this.config.files = savedFile.files
        }catch(e: any){
            if(e.code !== "ENOENT"){
                Logger.log("Failed to load config file", e)
                return;
            }
        }
    }

    private writeLog() {
        if (!this.config.auditFilename){
            return
        }
        try{
            makeDirectory(this.config.auditFilename);
            fs.writeFileSync(this.config.auditFilename, JSON.stringify(this.config,null,4));
        }catch(e){
            Logger.verbose("ERROR: Failed to store log audit", e);
        }
    }

    addLog(name: string) {
        if (!this.config.keepSettings || this.config.keepSettings?.amount == 0 || !this.config.auditFilename || this.config.auditFilename == "") {
            Logger.verbose("audit log missing")
            return
        }
        
        if (this.config.files.findIndex((file) => { return file.name === name}) !== -1) {
            Logger.debug("file already in the log", name)
            return
        }

        var time = Date.now();
        this.config.files.push({
            date: time,
            name: name,
            hash: crypto.createHash(this.config.hashType).update(name + "LOG_FILE" + time).digest("hex")
        });
        Logger.debug(`added file ${name} to log`)

        if (this.config.keepSettings && this.config.keepSettings.amount){
            if(this.config.keepSettings.type == KeepLogFiles.days){
                let date = Date.now() - 86400*this.config.keepSettings.amount*1000
                let files = this.config.files.filter((logEntry) => {
                    if (logEntry.date >= date) {
                        return true
                    }
                    this.removeLog(logEntry)                    
                })
                
                this.config.files = files
            } else if (this.config.files.length > this.config.keepSettings.amount){
                var filesToKeep = this.config.files.splice(-this.config.keepSettings.amount);
                if(this.config.files.length > 0){
                    this.config.files.filter((logEntry) => {
                        this.removeLog(logEntry);
                        return false;
                    })
                }
                this.config.files = filesToKeep
            }
        }

        this.writeLog()
    }

    private removeLog(logEntry: AuditEntry){
        if(logEntry.hash === crypto.createHash(this.config.hashType).update(logEntry.name + "LOG_FILE" + logEntry.date).digest("hex")){
            try{
                if (fs.existsSync(logEntry.name)) {
                    Logger.debug("removing log file", logEntry.name)
                    fs.unlinkSync(logEntry.name);
                    this.emitter.emit("logRemoved", logEntry.name)
                }
            }catch(e){
                Logger.verbose("Could not remove old log file: ", logEntry.name);
            }
        } else {
            Logger.debug("incorrect hash", logEntry.name, logEntry.hash, crypto.createHash(this.config.hashType).update(logEntry.name + "LOG_FILE" + logEntry.date).digest("hex"))
        }
    }
}