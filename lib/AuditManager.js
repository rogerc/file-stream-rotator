"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const enums_1 = require("./enums");
const helper_1 = require("./helper");
const crypto = require("crypto");
const sleep = require("sleep-promise");
class AuditManager {
    constructor(config, emitter) {
        this.config = config;
        this.emitter = emitter;
        this.loadLog();
    }
    loadLog() {
        var _a;
        if (!this.config.keepSettings || ((_a = this.config.keepSettings) === null || _a === void 0 ? void 0 : _a.amount) == 0 || !this.config.auditFilename || this.config.auditFilename == "") {
            helper_1.Logger.verbose("no existing audit settings found", this.config);
            return;
        }
        // Logger.debug("loaded audit settings", this.config)
        try {
            let full_path = path.resolve(this.config.auditFilename);
            let savedFile = JSON.parse(fs.readFileSync(full_path, { encoding: 'utf-8' }));
            this.config.files = savedFile.files;
        }
        catch (e) {
            if (e.code !== "ENOENT") {
                helper_1.Logger.log("Failed to load config file", e);
                return;
            }
        }
    }
    writeLog() {
        if (!this.config.auditFilename) {
            return;
        }
        try {
            (0, helper_1.makeDirectory)(this.config.auditFilename);
            fs.writeFileSync(this.config.auditFilename, JSON.stringify(this.config, null, 4));
        }
        catch (e) {
            helper_1.Logger.verbose("ERROR: Failed to store log audit", e);
        }
    }
    addLog(name) {
        var _a;
        if (!this.config.keepSettings || ((_a = this.config.keepSettings) === null || _a === void 0 ? void 0 : _a.amount) == 0 || !this.config.auditFilename || this.config.auditFilename == "") {
            helper_1.Logger.verbose("audit log missing");
            return;
        }
        if (this.config.files.findIndex((file) => { return file.name === name; }) !== -1) {
            helper_1.Logger.debug("file already in the log", name);
            return;
        }
        // add a random sleep to avoid concurrent writes to the same file
        sleep(Math.random() * 1000).then(() => {
            // read audit file again before updating it (mainly for nodejs cluster mode with concurrent writes from workers)
            this.loadLog();
            // check if file name is already present in the audit file and don't
            // include it in case is already there (mainly for nodejs cluster mode with concurrent writes from workers)
            var fileIsPresent = this.config.files.some((file) => file.name === name);
            if (!fileIsPresent) {
                var time = Date.now();
                this.config.files.push({
                    date: time,
                    name: name,
                    hash: crypto.createHash(this.config.hashType).update(name + "LOG_FILE" + time).digest("hex")
                });
                helper_1.Logger.debug(`added file ${name} to log`);
            }
            if (this.config.keepSettings && this.config.keepSettings.amount) {
                if (this.config.keepSettings.type == enums_1.KeepLogFiles.days) {
                    let date = Date.now() - 86400 * this.config.keepSettings.amount * 1000;
                    let files = this.config.files.filter((logEntry) => {
                        if (logEntry.date >= date) {
                            return true;
                        }
                        this.removeLog(logEntry);
                    });
                    this.config.files = files;
                }
                else if (this.config.files.length > this.config.keepSettings.amount) {
                    var filesToKeep = this.config.files.splice(-this.config.keepSettings.amount);
                    if (this.config.files.length > 0) {
                        this.config.files.filter((logEntry) => {
                            this.removeLog(logEntry);
                            return false;
                        });
                    }
                    this.config.files = filesToKeep;
                }
            }
            this.writeLog();
        });
    }
    removeLog(logEntry) {
        if (logEntry.hash === crypto.createHash(this.config.hashType).update(logEntry.name + "LOG_FILE" + logEntry.date).digest("hex")) {
            try {
                if (fs.existsSync(logEntry.name)) {
                    helper_1.Logger.debug("removing log file", logEntry.name);
                    fs.unlinkSync(logEntry.name);
                    this.emitter.emit("logRemoved", logEntry.name);
                }
            }
            catch (e) {
                helper_1.Logger.verbose("Could not remove old log file: ", logEntry.name);
            }
        }
        else {
            helper_1.Logger.debug("incorrect hash", logEntry.name, logEntry.hash, crypto.createHash(this.config.hashType).update(logEntry.name + "LOG_FILE" + logEntry.date).digest("hex"));
        }
    }
}
exports.default = AuditManager;
