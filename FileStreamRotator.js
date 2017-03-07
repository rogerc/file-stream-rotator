'use strict';

/*!
 * FileStreamRotator
 * Copyright(c) 2012 Holiday Extras.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var fs = require('fs');
var moment = require('moment');
var EventEmitter = require('events');

/**
 * FileStreamRotator:
 *
 * Returns a file stream that auto-rotates based on date.
 *
 * Options:
 *
 *   - `filename`   Filename including full path used by the stream
 *   - `frequency`  How often to rotate. At present only 'daily' and 'test' are available. 'test' rotates every minute.
 *                  If frequency is set to none of the above, a YYYYMMDD string will be added to the end of the filename.
 *   - `verbose`    If set, it will log to STDOUT when it rotates files and name of log file. Default is TRUE.
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

FileStreamRotator.getStream = function (options) {
    var frequencyMetaData = null;
    var curDate = null;
    var self = this;

    if (!options.filename) {
        console.error("No filename supplied. Defaulting to STDOUT");
        return process.stdout;
    }

    if (options.frequency) {
        frequencyMetaData = self.getFrequency(options.frequency);
    }

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
            console.log("Changing type to custom as date format changes more often than once a day or not every day");
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
        logfile = filename.replace('%DATE%',(curDate?curDate:self.getDate(null,dateFormat)));
    }
    var verbose = (options.verbose !== undefined ? options.verbose : true);
    if (verbose) {
        console.log("Logging to", logfile);
    }

    if(fileSize){
        var t_log = logfile;
        var f = null;
        while(f = fs.existsSync(t_log)){
            fileCount++;
            t_log = logfile + "." + fileCount;
        }
        logfile = t_log;
    }

    var rotateStream = fs.createWriteStream(logfile, {flags: 'a'});
    if (curDate && frequencyMetaData && (staticFrequency.indexOf(frequencyMetaData.type) > -1)) {
        if (verbose) {
            console.log("Rotating file", frequencyMetaData.type);
        }
        var stream = new EventEmitter();
        stream.end = function(){
            rotateStream.end.apply(rotateStream,arguments);
        };
        BubbleEvents(rotateStream,stream);

        stream.write = (function (str, encoding) {
            var newDate = this.getDate(frequencyMetaData,dateFormat);
            if (newDate != curDate || (fileSize && curSize > fileSize)) {
                var newLogfile = filename + (curDate ? "." + newDate : "");
                if(filename.match(/%DATE%/) && curDate){
                    newLogfile = filename.replace('%DATE%',newDate);
                }

                if(fileSize && curSize > fileSize){
                    fileCount++
                    newLogfile += "." + fileCount;
                }else{
                    // reset file count
                    fileCount = 0;
                }
                curSize = 0;

                if (verbose) {
                    console.log("Changing logs from %s to %s", logfile, newLogfile);
                }
                curDate = newDate;
                oldFile = logfile;
                logfile = newLogfile;
                rotateStream.destroy();
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
            console.log("File won't be rotated", options.frequency, frequencyMetaData && frequencyMetaData.type);
        }
        process.nextTick(function(){
            rotateStream.emit('new',logfile);
        })
        return rotateStream;
    }
}


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