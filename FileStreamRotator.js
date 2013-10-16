/*!
 * FileStreamRotator
 * Copyright(c) 2012 Holiday Extras.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var fs = require('fs');

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

module.exports = FileStreamRotator = {};

FileStreamRotator.getStream = function(options){

    function padNumber(number){
        if( number.toString().length < 2){
            return  "0" + number;
        }
        return number;
    }

    function getDate(format){
        var date = new Date();
        switch(format){
            case 'test':
            case 'minute':
                return ( date.getFullYear() + "" + padNumber((date.getMonth()+1)) + "" + padNumber(date.getDate()) +
                    "" + padNumber(date.getHours()) + "" + padNumber(date.getMinutes()) );
                break;
            case '5minutes':
                return ( date.getFullYear() + "" + padNumber((date.getMonth()+1)) + "" + padNumber(date.getDate()) +
                    "" + padNumber(date.getHours()) + "" + padNumber(parseInt((new Date()).getMinutes()/5)*5) );
                break;
            case 'hourly':
                return ( date.getFullYear() + "" + padNumber((date.getMonth()+1)) + "" + padNumber(date.getDate()) +
                    "" + padNumber(date.getHours()) + "00");
                break;
            default:
                return date.getFullYear() + "" + padNumber((date.getMonth()+1)) + "" + padNumber(date.getDate());
                break;

        }
    }

    if(!options.filename){
        console.error("No filename supplied. Defaulting to STDOUT");
        return process.stdout;
    }
    
    var curDate = (options.frequency?getDate(options.frequency):"");
    var filename = options.filename;
    var logfile = filename + (curDate?"." + curDate:"");
    var verbose = (options.verbose !== undefined?options.verbose:true);
    if(verbose){
        console.log("Logging to " + logfile);
    }
    var rotateStream = fs.createWriteStream(logfile, {flags: 'a'});
    switch(options.frequency){
        case 'test':
        case 'minute':
        case '5minutes':
        case 'hourly':
        case 'daily':
            if(verbose){
                console.log("Rotating file " + options.frequency);
            }
            var stream = {end: rotateStream.end};
            stream.write = (function(str,encoding){
                var newDate = getDate(options.frequency);
                if(newDate != curDate){
                    var newLogfile = filename + (curDate?"." + newDate:"");
                    if(verbose){
                        console.log("Changing logs from " + logfile+ " to " + newLogfile);
                    }
                    curDate = newDate;
                    logfile = newLogfile;
                    rotateStream.destroy();
                    rotateStream = fs.createWriteStream(newLogfile, {flags: 'a'});
                }
                rotateStream.write(str,encoding);

            }).bind(this);
            return stream;
        default:
            if(verbose){
                console.log("File won't be rotated");
            }
            return rotateStream;
    }
}