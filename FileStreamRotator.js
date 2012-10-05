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
 *   - `filename`  Filename including full path used by the stream
 *   - `frequency`  How often to rotate. At present only 'daily' and 'test' are available. 'test' rotates every minute.
 *                  If frequency is set to none of the above, a YYYYMMDD string will be added to the end of the filename.
 *
 * To use with Express / Connect, use as below.
 *
 * var rotatingLogStream = require('FileStreamRotator').getStream({filename:"/tmp/test.log", frequency:"daily"})
 * app.use(express.logger({stream: rotatingLogStream, format: "default"}));
 *
 * @param {Object} options
 * @return {Object}
 * @api public
 */

module.exports = FileStreamRotator = {};

FileStreamRotator.getStream = function(options){

    function getDate(format){
        var date = new Date();
        switch(format){
            case 'test':
                return ( date.getFullYear() + "" + (date.getMonth()+1) + "" + (date.getDate() < 10?"0" + date.getDate():date.getDate()) +
                    "" + date.getHours() + "" + date.getMinutes() )
                    ;
            default:
                return date.getFullYear() + "" + (date.getMonth()+1) + "" + (date.getDate() < 10?"0" + date.getDate():date.getDate());

        }
    }

    if(!options.filename){
        console.error("No filename supplied. Defaulting to STDOUT");
        return process.stdout;
    }
    
    var curDate = (options.frequency?getDate(options.frequency):"");
    var filename = options.filename;
    var logfile = filename + (curDate?"." + curDate:"");
    console.error("Logging to " + logfile);
    var rotateStream = fs.createWriteStream(logfile, {flags: 'a'});
    switch(options.frequency){
        case 'test':
        case 'daily':
            console.error("Rotating file " + options.frequency);
            var stream = {end: rotateStream.end};
            stream.write = (function(str,encoding){
                var newDate = getDate(options.frequency);
                if(newDate != curDate){
                    var newLogfile = filename + (curDate?"." + newDate:"");
                    console.error("Changing logs from " + logfile+ " to " + newLogfile);
                    curDate = newDate;
                    rotateStream.destroy();
                    rotateStream = fs.createWriteStream(newLogfile, {flags: 'a'});
                }
                rotateStream.write(str,encoding);

            }).bind(this);
            return stream;
        default:
            console.error("File won't be rotated");
            return rotateStream;
    }
}