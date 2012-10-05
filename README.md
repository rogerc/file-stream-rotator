file-stream-rotator
===================

NodeJS file stream rotator


## Purpose

To provide an automated rotation of Express/Connect logs based on date.

## Usage

    var rotatingLogStream = require('FileStreamRotator').getStream({filename:"/tmp/test.log", frequency:"daily"})
    .....
    // Use new stream in express
    app.use(express.logger({stream: rotatingLogStream, format: "default"}));

## TODO

* submit module to NPM