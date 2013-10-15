file-stream-rotator
===================

NodeJS file stream rotator

## Purpose

To provide an automated rotation of Express/Connect logs based on date.

## Install

```
npm install file-stream-rotator
```

## Usage

    var rotatingLogStream = require('file-stream-rotator').getStream({filename:"/tmp/test.log", frequency:"daily", verbose: false})
    .....
    // Use new stream in express
    app.use(express.logger({stream: rotatingLogStream, format: "default"}));
    .....
    frequency options include:
    * daily
    * rotate on given minutes using the 'm' option i.e. 5m or 30m
    * rotate on the hour or any specified number of hours
    * test - creates a log file with a date suffix

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)
* [Roger Castells](http://github.com/rogerc)
* [Viktor Trako](http://github.com/viktort)

## License

file-stream-rotator is licensed under the MIT license.