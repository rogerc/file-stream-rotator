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

    var rotatingLogStream = require('file-stream-rotator').getStream({filename:"/tmp/test.log", frequency:"daily"})
    .....
    // Use new stream in express
    app.use(express.logger({stream: rotatingLogStream, format: "default"}));

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)
* [Roger Castells](http://github.com/hxroger)
* [Viktor Trako](http://github.com/viktort)

## License

file-stream-rotator is licensed under the MIT license.