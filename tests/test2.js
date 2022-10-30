"use strict";
exports.__esModule = true;
// import FileStreamRotator from "../lib/FileStreamRotator";
var FileStreamRotator = require("../../file-stream-rotator");
var rotatingLogStream = FileStreamRotator.getStream({
    filename: "logs/1m/testlog-%DATE%",
    frequency: "1m",
    verbose: true,
    date_format: "YYYY-MM-DD.HH.mm",
    size: "100K",
    // max_logs: "6",
    audit_file: "/tmp/audit20221026.json",
    end_stream: false,
    utc: true,
    extension: ".log",
    create_symlink: true,
    symlink_name: "tail.log"
});
rotatingLogStream.on("rotate", function (oldFile, newFile) {
    console.log(Date.now(), Date(), "stream rotated", oldFile, newFile);
});
rotatingLogStream.on("open", function (fd) {
    console.log(Date.now(), Date(), "stream open", fd);
});
var counter = 0;
var i = setInterval(function () {
    counter++;
    rotatingLogStream.write(Date() + "\t" + "testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890-testing 1234567890\n");
    if (counter == 50000) {
        clearInterval(i);
        rotatingLogStream.end("end\n");
    }
}, 10);
