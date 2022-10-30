"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const fs = require("fs");
const path = require("path");
const enums_1 = require("./enums");
const DefaultOptions_1 = require("./DefaultOptions");
const Rotator_1 = require("./Rotator");
const AuditManager_1 = require("./AuditManager");
const helper_1 = require("./helper");
class FileStreamRotator extends node_stream_1.EventEmitter {
    // private logWatcher?: FSWatcher
    constructor(options) {
        var _a, _b;
        super();
        this.config = {};
        this.config = this.parseOptions(options);
        helper_1.Logger.getInstance(options.verbose, false);
        this.auditManager = new AuditManager_1.default((_a = this.config.auditSettings) !== null && _a !== void 0 ? _a : DefaultOptions_1.default.auditSettings({}), this);
        let lastEntry = this.auditManager.config.files.slice(-1).shift();
        this.rotator = new Rotator_1.default(((_b = this.config.rotationSettings) !== null && _b !== void 0 ? _b : DefaultOptions_1.default.rotationSettings({})), lastEntry);
        this.rotate();
        // this does not seem to work anymore.
        // this.on("open", (filename: string) => {
        //     // monitor for file deletion
        //     if (this.config.options?.watch_log) {
        //         console.log(">>> setting up watcher", filename)
        //         this.logWatcher = this.createLogWatcher(filename, this.processWatcherEvents.bind(this))
        //     }
        // })
    }
    static getStream(options) {
        return new FileStreamRotator(options);
    }
    parseOptions(options) {
        var _a, _b, _c, _d;
        let config = {};
        config.options = DefaultOptions_1.default.fileStreamRotatorOptions(options);
        config.fileOptions = DefaultOptions_1.default.fileOptions((_a = options.file_options) !== null && _a !== void 0 ? _a : {});
        let auditSettings = DefaultOptions_1.default.auditSettings({});
        if (options.audit_file) {
            auditSettings.auditFilename = options.audit_file;
        }
        if (options.audit_hash_type) {
            auditSettings.hashType = options.audit_hash_type;
        }
        if (options.extension) {
            auditSettings.extension = options.extension;
        }
        if (options.max_logs) {
            let params = DefaultOptions_1.default.extractParam(options.max_logs);
            auditSettings.keepSettings = {
                type: ((_b = params.letter) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "d" ? enums_1.KeepLogFiles.days : enums_1.KeepLogFiles.fileCount,
                amount: params.number
            };
        }
        config.auditSettings = auditSettings;
        config.rotationSettings = DefaultOptions_1.default.rotationSettings({ filename: options.filename, extension: options.extension });
        if (options.date_format && !options.frequency) {
            config.rotationSettings.frequency = enums_1.Frequency.date;
        }
        else {
            config.rotationSettings.frequency = enums_1.Frequency.none;
        }
        if (options.date_format) {
            config.rotationSettings.format = options.date_format;
        }
        config.rotationSettings.utc = (_c = options.utc) !== null && _c !== void 0 ? _c : false;
        switch (options.frequency) {
            case "daily":
                config.rotationSettings.frequency = enums_1.Frequency.daily;
                break;
            case "custom":
            case "date":
                config.rotationSettings.frequency = enums_1.Frequency.date;
                break;
            case "test":
                config.rotationSettings.frequency = enums_1.Frequency.minutes;
                config.rotationSettings.amount = 1;
                break;
            default:
                if (options.frequency) {
                    let params = DefaultOptions_1.default.extractParam(options.frequency);
                    if ((_d = params.letter) === null || _d === void 0 ? void 0 : _d.match(/^([mh])$/)) {
                        config.rotationSettings.frequency = params.letter == "h" ? enums_1.Frequency.hours : enums_1.Frequency.minutes;
                        config.rotationSettings.amount = params.number;
                    }
                }
        }
        if (options.size) {
            let params = DefaultOptions_1.default.extractParam(options.size);
            switch (params.letter) {
                case 'k':
                    config.rotationSettings.maxSize = params.number * 1024;
                    break;
                case 'm':
                    config.rotationSettings.maxSize = params.number * 1024 * 1024;
                    break;
                case 'g':
                    config.rotationSettings.maxSize = params.number * 1024 * 1024 * 1024;
                    break;
            }
        }
        this.rotator = new Rotator_1.default(config.rotationSettings);
        let oldFile = this.rotator.getNewFilename();
        return config;
    }
    rotate() {
        var _a;
        let oldFile = this.currentFile;
        this.rotator.rotate();
        this.currentFile = this.rotator.getNewFilename();
        // oldfile same as new file. do nothing
        if (this.currentFile == oldFile) {
            return;
        }
        // close old file and watcher if exists.
        if (this.fs) {
            // if (this.logWatcher) {
            //     this.logWatcher.close()
            // }
            if (((_a = this.config.options) === null || _a === void 0 ? void 0 : _a.end_stream) === true) {
                this.fs.end();
            }
            else {
                this.fs.destroy();
            }
        }
        // add old file to audit
        if (oldFile) {
            this.auditManager.addLog(oldFile);
        }
        this.createNewLog(this.currentFile);
        this.emit('new', this.currentFile);
        this.emit('rotate', oldFile, this.currentFile);
    }
    createNewLog(filename) {
        var _a;
        // create new directory if required
        (0, helper_1.makeDirectory)(filename);
        // add mew file tp audit
        this.auditManager.addLog(filename);
        // create new file
        let streamOptions = {};
        if (this.config.fileOptions) {
            streamOptions = this.config.fileOptions;
        }
        this.fs = fs.createWriteStream(filename, streamOptions);
        // setup dependencies: proxy events, emit events
        this.bubbleEvents(this.fs);
        // setup symlink
        if ((_a = this.config.options) === null || _a === void 0 ? void 0 : _a.create_symlink) {
            this.createCurrentSymLink(filename);
        }
    }
    write(str, encoding) {
        if (this.fs) {
            if (this.rotator.shouldRotate()) {
                this.rotate();
            }
            this.fs.write(str, encoding !== null && encoding !== void 0 ? encoding : "utf8");
            this.rotator.addBytes(Buffer.byteLength(str, encoding));
            if (this.rotator.hasMaxSizeReached()) {
                this.rotate();
            }
        }
    }
    end(str) {
        if (this.fs) {
            this.fs.end(str);
            this.fs = undefined;
        }
    }
    bubbleEvents(emitter) {
        emitter.on('close', () => { this.emit('close'); });
        emitter.on('finish', () => { this.emit('finish'); });
        emitter.on('error', (err) => { this.emit('error', err); });
        emitter.on('open', (fd) => { this.emit('open', this.currentFile); });
    }
    createCurrentSymLink(logfile) {
        var _a, _b;
        if (!logfile) {
            return;
        }
        let symLinkName = (_b = (_a = this.config.options) === null || _a === void 0 ? void 0 : _a.symlink_name) !== null && _b !== void 0 ? _b : "current.log";
        let logPath = path.dirname(logfile);
        let logfileName = path.basename(logfile);
        let current = logPath + path.sep + symLinkName;
        try {
            if (fs.existsSync(current)) {
                let stats = fs.lstatSync(current);
                if (stats.isSymbolicLink()) {
                    fs.unlinkSync(current);
                    fs.symlinkSync(logfileName, current);
                    return;
                }
                helper_1.Logger.verbose("Could not create symlink file as file with the same name exists: ", current);
            }
            else {
                fs.symlinkSync(logfileName, current);
            }
        }
        catch (err) {
            helper_1.Logger.verbose("[Could not create symlink file: ", current, ' -> ', logfileName);
            helper_1.Logger.debug("error creating sym link", current, err);
        }
    }
    /*
    // does not seem to work anymore
    private createLogWatcher(logfile: string, processEvent: ((event: fs.WatchEventType, file: string) => void)): FSWatcher | undefined{
        if(!logfile) return
        try {
            if (!fs.existsSync(logfile)) {
                Logger.verbose("Watcher error: file does not exist" + logfile);
                return
            }
            let stats = fs.lstatSync(logfile)
            return fs.watch(logfile, (event, filename) => {
                processEvent(event, filename)
            })
        }catch(err){
            Logger.verbose("Could not add watcher for " + logfile, err);
            return
        }
    }

    private processWatcherEvents(event: fs.WatchEventType, filename: string) {
        if (!this.currentFile) { return }
        if (filename == this.currentFile){
            if (event == "rename") {
                if (this.logWatcher) {
                    this.logWatcher.close()
                }
                this.createNewLog(this.currentFile)
            }
        }
    }
    */
    test() {
        return { config: this.config, rotator: this.rotator };
    }
}
exports.default = FileStreamRotator;
