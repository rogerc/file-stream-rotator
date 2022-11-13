// import FileStreamRotator from '../../file-stream-rotator';
// var FileStreamRotator = require('../../file-stream-rotator');
// var rotatingLogStream = require('../lib/index').getStream({

// console.log(FileStreamRotator)

// var rotatingLogStream = FileStreamRotator.getStream({
var rotatingLogStream = require('../../file-stream-rotator').getStream({
    filename: "logs/1m/testlog-%DATE%", 
    frequency: "1m", 
    verbose: true, 
    date_format: "YYYY-MM-DD.HH.mm", 
    // size: "500k", 
    // max_logs: "6",
    audit_file: "/tmp/audit20221026.json",
    end_stream: false,
    utc: true,
    extension: ".log",
    create_symlink: true,
    symlink_name: "tail.log"
});

rotatingLogStream.on("error", function () {
    console.log(Date.now(), Date(), "stream error", arguments)
})

rotatingLogStream.on("close", function () {
    console.log(Date.now(), Date(), "stream closed")
})

rotatingLogStream.on("finish", function () {
    console.log(Date.now(), Date(), "stream finished")
})

rotatingLogStream.on("rotate", function (oldFile, newFile) {
    console.log(Date.now(), Date(), "stream rotated", oldFile, newFile);
})

rotatingLogStream.on("open", function (fd) {
    console.log(Date.now(), Date(), "stream open", fd);
})

rotatingLogStream.on("new", function (newFile) {
    console.log(Date.now(), Date(), "stream new", newFile);
})

rotatingLogStream.on("logRemoved", function (newFile) {
    console.log(Date.now(), Date(), "stream logRemoved", newFile);
})

var counter = 0;
var i = setInterval(function () {
    counter++;
    rotatingLogStream.write(Date() + "\t" + "testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890\n")
    if (counter == 50000) {
        clearInterval(i);
        rotatingLogStream.end("end\n");
    }
}, 10);

        // if (options.verbose) {
        //     let orginalLog = console.log
        //     console.log = (...data) => {
        //         if (this.config.options?.verbose) {
        //             orginalLog.apply(null, data)
        //         }
        //     }
        // }
