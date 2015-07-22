####NOTE: This project is no longer maintained. If you're interested in taking ownership, please contact us####

file-stream-rotator
===================

[![Code Climate](https://codeclimate.com/github/holidayextras/file-stream-rotator.png)](https://codeclimate.com/github/holidayextras/file-stream-rotator)

NodeJS file stream rotator

## Purpose

To provide an automated rotation (roll-over) of Express/Connect logs based on date.

## Install

```
npm install file-stream-rotator
```

## Usage

More detailed API documentation is in the next section.

```javascript
var fileStreamRotator = require("file-stream-rotator");

// Default date format, added at the end of the file
var rotatingLogStream = fileStreamRotator.getStream({
	filename: "/tmp/test.log",
	frequency: "daily"
});

// Default date format, added using filename pattern
var rotatingLogStream = fileStreamRotator.getStream({
	filename: "/tmp/test-%DATE%.log",
	frequency: "daily"
});

// Custom date format, added using filename pattern
var rotatingLogStream = fileStreamRotator.getStream({
	filename: "/tmp/test-%DATE%.log",
	frequency: "daily",
	dateFormat: "YYYY-MM-DD"
});
```

Example use in Express:

```javascript
app.use(express.logger({
	stream: rotatingLogStream,
	format: "combined"
}));
```

## API

### fileStreamRotator.getStream(options)

Creates a new rotating stream. `filename` and `frequency` are required options.

* __filename__: The path to use for saving the logfiles. You can currently specify it in two different ways:
	* `"/path/to/file-%DATE%.log"`: The %DATE% string will be replaced with the actual timestamp for the log. Eg. `/path/to/file-201504210000.log`
	* `"/path/to/file.log"`: The timestamp will be appended with a dot. Eg. `/path/to/file.log.201504210000`
* __frequency__: The roll-over frequency, ie. how frequently a new logfile should be created. Valid formats:
	* `daily`: Short-hand option for `1d`.
	* `Xd`: Every X days, eg. `2d`.
	* `Xh`: Every X hours, eg. `2h`.
	* `Xm`: Every X minutes, eg. `2m`.
* __dateFormat__: *Optional, defaults to `YYYYMMDDHHmm`*. The date format to use in the log filename. Takes [Moment.js date formats](http://momentjs.com/docs/#/displaying/format/).

## Changes from 0.x

* The `verbose` option no longer exists. To get information about log roll-overs, use the `DEBUG` environment variable ([more info](https://www.npmjs.com/package/debug)).
* `date_format` has been renamed to `dateFormat` for naming consistency.
* Only `.getStream` is still exposed, all other methods are internal.
* The `test` frequency is no longer supported.

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)
* [Roger Castells](http://github.com/rogerc)
* [Viktor Trako](http://github.com/viktort)

## License

file-stream-rotator is licensed under the MIT license.
