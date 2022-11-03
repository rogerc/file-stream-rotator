'use strict';

/*!
 * FileStreamRotator
 * Copyright(c) 2012-2017 Holiday Extras.
 * Copyright(c) 2017 Roger C.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var crypto = require('crypto');

var EventEmitter = require('events');

/**
 * FileStreamRotator:
 *
 * Returns a file stream that auto-rotates based on date.
 *
 * Options:
 *
 *   - `filename`       Filename including full path used by the stream
 *
 *   - `frequency`      How often to rotate. Options are 'daily', 'custom' and 'test'. 'test' rotates every minute.
 *                      If frequency is set to none of the above, a YYYYMMDD string will be added to the end of the filename.
 *
 *   - `verbose`        If set, it will log to STDOUT when it rotates files and name of log file. Default is TRUE.
 *
 *   - `date_format`    Format as used in moment.js http://momentjs.com/docs/#/displaying/format/. The result is used to replace
 *                      the '%DATE%' placeholder in the filename.
 *                      If using 'custom' frequency, it is used to trigger file change when the string representation changes.
 *
 *   - `size`           Max size of the file after which it will rotate. It can be combined with frequency or date format.
 *                      The size units are 'k', 'm' and 'g'. Units need to directly follow a number e.g. 1g, 100m, 20k.
 *
 *   - `max_logs`       Max number of logs to keep. If not set, it won't remove past logs. It uses its own log audit file
 *                      to keep track of the log files in a json format. It won't delete any file not contained in it.
 *                      It can be a number of files or number of days. If using days, add 'd' as the suffix.
 *
 *   - `audit_file`     Location to store the log audit file. If not set, it will be stored in the root of the application.
 *
 * To use with Express / Connect, use as below.
 *
 * var rotatingLogStream = require('FileStreamRotator').getStream({filename:"/tmp/test.log", frequency:"daily", verbose: false})
 * app.use(express.logger({stream: rotatingLogStream, format: "default"}));
 *
 * @param {Object} options
 * @return {Object}
 * @api public
 */
var FileStreamRotator = {};

module.exports = FileStreamRotator;

var staticFrequency = ['daily', 'test', 'm', 'h', 'custom'];
var DATE_FORMAT = ('YYYYMMDDHHmm');


/**
 * Returns frequency metadata for minute/hour rotation
 * @param type
 * @param num
 * @returns {*}
 * @private
 */
var _checkNumAndType = function (type, num) {
    if (typeof num == 'number') {
        switch (type) {
            case 'm':
                if (num < 0 || num > 60) {
                    return false;
                }
                break;
            case 'h':
                if (num < 0 || num > 24) {
                    return false;
                }
                break;
        }
        return {type: type, digit: num};
    }
}

/**
 * Returns frequency metadata for defined frequency
 * @param freqType
 * @returns {*}
 * @private
 */
var _checkDailyAndTest = function (freqType) {
    switch (freqType) {
        case 'custom':
        case 'daily':
            return {type: freqType, digit: undefined};
            break;
        case 'test':
            return {type: freqType, digit: 0};
    }
    return false;
}


/**
 * Returns frequency metadata
 * @param frequency
 * @returns {*}
 */
FileStreamRotator.getFrequency = function (frequency) {
    var _f = frequency.toLowerCase().match(/^(\d+)([m|h])$/)
    if(_f){
        return _checkNumAndType(_f[2], parseInt(_f[1]));
    }

    var dailyOrTest = _checkDailyAndTest(frequency);
    if (dailyOrTest) {
        return dailyOrTest;
    }

    return false;
}

/**
 * Returns a number based on the option string
 * @param size
 * @returns {Number}
 */
FileStreamRotator.parseFileSize = function (size) {
    if(size && typeof size == "string"){
        var _s = size.toLowerCase().match(/^((?:0\.)?\d+)([k|m|g])$/);
        if(_s){
            switch(_s[2]){
                case 'k':
                    return _s[1]*1024
                case 'm':
                    return _s[1]*1024*1024
                case 'g':
                    return _s[1]*1024*1024*1024
            }
        }
    }
    return null;
};

/**
 * Returns date string for a given format / date_format
 * @param format
 * @param date_format
 * @returns {string}
 */
FileStreamRotator.getDate = function (format, date_format) {
    date_format = date_format || DATE_FORMAT;
    if (format && staticFrequency.indexOf(format.type) !== -1) {
        switch (format.type) {
            case 'm':
                var minute = Math.floor(moment().minutes() / format.digit) * format.digit;
                return moment().minutes(minute).format(date_format);
                break;
            case 'h':
                var hour = Math.floor(moment().hour() / format.digit) * format.digit;
                return moment().hour(hour).format(date_format);
                break;
            case 'daily':
            case 'custom':
            case 'test':
                return moment().format(date_format);
        }
    }
    return moment().format(date_format);
}

/**
 * Read audit json object from disk or return new object or null
 * @param max_logs
 * @param audit_file
 * @param log_file
 * @returns {Object} auditLogSettings
 * @property {Object} auditLogSettings.keep
 * @property {Boolean} auditLogSettings.keep.days
 * @property {Number} auditLogSettings.keep.amount
 * @property {String} auditLogSettings.auditLog
 * @property {Array} auditLogSettings.files
 */
FileStreamRotator.setAuditLog = function (max_logs, audit_file, log_file){
    var _rtn = null;
    if(max_logs){
        var use_days = max_logs.toString().substr(-1);
        var _num = max_logs.toString().match(/^(\d+)/);

        if(Number(_num[1]) > 0) {
            var baseLog = path.dirname(log_file.replace(/%DATE%.+/,"_filename"));

            try{
                if(audit_file){
                    var full_path = path.resolve(audit_file);
                    _rtn = require(full_path);
                }else{
                    var full_path = path.resolve(baseLog + "/" + ".audit.json")
                    _rtn = require(full_path);
                }
            }catch(e){
                if(e.code !== "MODULE_NOT_FOUND"){
                    return null;
                }
                _rtn = {
                    keep: {
                        days: false,
                        amount: Number(_num[1])
                    },
                    auditLog: audit_file || baseLog + "/" + ".audit.json",
                    files: []
                };
            }

            _rtn.keep = {
                days: use_days === 'd',
                amount: Number(_num[1])
            };

        }
    }
    return _rtn;
};

/**
 * Write audit json object to disk
 * @param {Object} audit
 * @param {Object} audit.keep
 * @param {Boolean} audit.keep.days
 * @param {Number} audit.keep.amount
 * @param {String} audit.auditLog
 * @param {Array} audit.files
 */
FileStreamRotator.writeAuditLog = function(audit){
    try{
        mkDirForFile(audit.auditLog);
        fs.writeFileSync(audit.auditLog, JSON.stringify(audit,null,4));
    }catch(e){
        console.error(new Date(),"[FileStreamRotator] Failed to store log audit at:", audit.auditLog,"Error:", e);
    }
};


/**
 * Removes old log file
 * @param file
 * @param file.hash
 * @param file.name
 * @param file.date
 */
function removeFile(file){
    if(file.hash === crypto.createHash('md5').update(file.name + "LOG_FILE" + file.date).digest("hex")){
        try{
            fs.unlinkSync(file.name);
        }catch(e){
            console.error(new Date(), "[FileStreamRotator] Could not remove old log file: ", file.name, "Error:", e);
        }
    }
}

// Public Remove File
FileStreamRotator.removeFile(file) = removeFile(file)

/**
 * Write audit json object to disk
 * @param {String} logfile
 * @param {Object} audit
 * @param {Object} audit.keep
 * @param {Boolean} audit.keep.days
 * @param {Number} audit.keep.amount
 * @param {String} audit.auditLog
 * @param {Array} audit.files
 */
FileStreamRotator.addLogToAudit = function(logfile, audit){
    if(audit && audit.files){
        var time = Date.now();
        audit.files.push({
            date: time,
            name: logfile,
            hash: crypto.createHash('md5').update(logfile + "LOG_FILE" + time).digest("hex")
        });

        if(audit.keep.days){
            var oldestDate = moment().subtract(audit.keep.amount,"days").valueOf();
            var recentFiles = audit.files.filter(function(file){
                if(file.date > oldestDate){
                    return true;
                }
                removeFile(file);
                return false;
            });
            audit.files = recentFiles;
        }else{
            var filesToKeep = audit.files.splice(-audit.keep.amount);
            if(audit.files.length > 0){
                audit.files.filter(function(file){
                    removeFile(file);
                    return false;
                })
            }
            audit.files = filesToKeep;
        }

        FileStreamRotator.writeAuditLog(audit);
    }

    return audit;
}

/**
 *
 * @param options
 * @param options.filename
 * @param options.frequency
 * @param options.verbose
 * @param options.date_format
 * @param options.size
 * @param options.max_logs
 * @param options.audit_file
 * @returns {Object} stream
 */
FileStreamRotator.getStream = function (options) {
    var frequencyMetaData = null;
    var curDate = null;
    var self = this;

    if (!options.filename) {
        console.error(new Date(),"[FileStreamRotator] No filename supplied. Defaulting to STDOUT");
        return process.stdout;
    }

    if (options.frequency) {
        frequencyMetaData = self.getFrequency(options.frequency);
    }

    self.auditLog = self.setAuditLog(options.max_logs, options.audit_file, options.filename);

    var fileSize = null;
    var fileCount = 0;
    var curSize = 0;
    if(options.size){
        fileSize = FileStreamRotator.parseFileSize(options.size);
    }

    var dateFormat = (options.date_format || DATE_FORMAT);
    if(frequencyMetaData && frequencyMetaData.type == "daily"){
        if(!options.date_format){
            dateFormat = "YYYY-MM-DD";
        }
        if(moment().format(dateFormat) != moment().add(2,"hours").format(dateFormat) || moment().format(dateFormat) == moment().add(1,"day").format(dateFormat)){
            if(options.verbose){
                console.log(new Date(),"[FileStreamRotator] Changing type to custom as date format changes more often than once a day or not every day");
            }
            frequencyMetaData.type = "custom";
        }
    }

    if (frequencyMetaData) {
        curDate = (options.frequency ? self.getDate(frequencyMetaData,dateFormat) : "");
    }

    var filename = options.filename;
    var oldFile = null;
    var logfile = filename + (curDate ? "." + curDate : "");
    if(filename.match(/%DATE%/)){
        logfile = filename.replace(/%DATE%/g,(curDate?curDate:self.getDate(null,dateFormat)));
    }
    var verbose = (options.verbose !== undefined ? options.verbose : true);
    if (verbose) {
        console.log(new Date(),"[FileStreamRotator] Logging to: ", logfile);
    }

    if(fileSize){
        var lastLogFile = null;
        var t_log = logfile;
        var f = null;
        while(f = fs.existsSync(t_log)){
            lastLogFile = t_log;
            fileCount++;
            t_log = logfile + "." + fileCount;
        }
        if(lastLogFile){
            var lastLogFileStats = fs.statSync(lastLogFile);
            if(lastLogFileStats.size < fileSize){
                t_log = lastLogFile;
                fileCount--;
                curSize = lastLogFileStats.size;
            }
        }
        logfile = t_log;
    }

    mkDirForFile(logfile);

    var rotateStream = fs.createWriteStream(logfile, {flags: 'a'});
    if (curDate && frequencyMetaData && (staticFrequency.indexOf(frequencyMetaData.type) > -1)) {
        if (verbose) {
            console.log(new Date(),"[FileStreamRotator] Rotating file: ", frequencyMetaData.type);
        }
        var stream = new EventEmitter();
        stream.end = function(){
            rotateStream.end.apply(rotateStream,arguments);
        };
        BubbleEvents(rotateStream,stream);

        stream.on("new",function(newLog){
            self.auditLog = self.addLogToAudit(newLog,self.auditLog);

        });

        stream.write = (function (str, encoding) {
            var newDate = this.getDate(frequencyMetaData,dateFormat);
            if (newDate != curDate || (fileSize && curSize > fileSize)) {
                var newLogfile = filename + (curDate ? "." + newDate : "");
                if(filename.match(/%DATE%/) && curDate){
                    newLogfile = filename.replace(/%DATE%/g,newDate);
                }

                if(fileSize && curSize > fileSize){
                    fileCount++;
                    newLogfile += "." + fileCount;
                }else{
                    // reset file count
                    fileCount = 0;
                }
                curSize = 0;

                if (verbose) {
                    console.log(new Date(),"[FileStreamRotator] Changing logs from %s to %s", logfile, newLogfile);
                }
                curDate = newDate;
                oldFile = logfile;
                logfile = newLogfile;
                rotateStream.destroy();

                mkDirForFile(logfile);

                rotateStream = fs.createWriteStream(newLogfile, {flags: 'a'});
                stream.emit('new',newLogfile);
                stream.emit('rotate',oldFile, newLogfile);
                BubbleEvents(rotateStream,stream);
            }
            rotateStream.write(str, encoding);
            curSize += str.length
        }).bind(this);
        process.nextTick(function(){
            stream.emit('new',logfile);
        })
        return stream;
    } else {
        if (verbose) {
            console.log(new Date(),"[FileStreamRotator] File won't be rotated: ", options.frequency, frequencyMetaData && frequencyMetaData.type);
        }
        process.nextTick(function(){
            rotateStream.emit('new',logfile);
        })
        return rotateStream;
    }
}

/**
 * Check and make parent directory
 * @param pathWithFile
 */
var mkDirForFile = function(pathWithFile){
    var _path = path.dirname(pathWithFile);
    _path.split(path.sep).reduce(
        function(fullPath, folder) {
            fullPath += folder + path.sep;
            // Option to replace existsSync as deprecated. Maybe in a future release.
            // try{
            //     var stats = fs.statSync(fullPath);
            //     console.log('STATS',fullPath, stats);
            // }catch(e){
            //     fs.mkdirSync(fullPath);
            //     console.log("STATS ERROR",e)
            // }
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath);
            }
            return fullPath;
        },
        ''
    );
};


/**
 * Bubbles events to the proxy
 * @param emitter
 * @param proxy
 * @constructor
 */
var BubbleEvents = function BubbleEvents(emitter,proxy){
    emitter.on('close',function(){
        proxy.emit('close');
    })
    emitter.on('finish',function(){
        proxy.emit('finish');
    })
    emitter.on('error',function(err){
        proxy.emit('error',err);
    })
    emitter.on('open',function(fd){
        proxy.emit('open',fd);
    })
}