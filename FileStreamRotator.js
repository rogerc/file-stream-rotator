'use strict';

/*!
 * FileStreamRotator
 * Copyright(c) 2012 Holiday Extras.
 * Copyright(c) 2015 Sven Slootweg
 * MIT Licensed
 */

var fs = require("fs");
var moment = require("moment");
var debug = require("debug")("file-stream-rotator");

var durationMatcher = /^([0-9]+)([mhd])$/

function _normalizeDuration(duration) {
	var normalizedDuration, match;

	if(duration === "daily") {
		normalizedDuration = [1, "d"];
	} else if(match = duration.match(durationMatcher)) {
		normalizedDuration = match.slice(1, 3);
	} else {
		throw new Error("Invalid duration specified.");
	}

	return normalizedDuration;
}

function _makeMomentDuration(duration) {
	return moment.duration(parseInt(duration[0]), duration[1]);
}

function _roundMoment(momentObj, duration) {
	/* To make this function non-mutating... */
	momentObj = momentObj.clone();

	switch(duration[1]) {
		case "d": // day
			return momentObj.startOf("day");
			break;
		case "h": // hour
			return momentObj.startOf("hour");
			break;
		case "m": // minute
			return momentObj.startOf("minute");
			break;
	}
}

function _makeStream(momentObj, options) {
	var filename = _generateFilename(momentObj, options);
	return fs.createWriteStream(filename, {flags: "a"})
}

function _generateFilename(momentObj, options) {
	/* This function expects a pre-rounded Moment object. */
	var formattedTimestamp = momentObj.format(options.dateFormat);

	if(options.filename.indexOf("%DATE%") !== -1) {
		/* Pre-formatted %DATE%, like in 0.x */
		return options.filename.replace("%DATE%", formattedTimestamp);
	} else {
		/* Plain path, with pre-formatted %DATE% appended, like in 0.x */
		return options.filename + "." + formattedTimestamp;
	}
}

var FileStreamRotator = {};

FileStreamRotator.getStream = function getStream(options) {
	if(options.filename == null) {
		throw new Error("No filename specified.");
	}

	if(options.dateFormat == null) {
		options.dateFormat = "YYYYMMDDHHmm";
	}

	var fakeStream = {};
	var duration = _normalizeDuration(options.frequency);
	var momentDuration = _makeMomentDuration(duration);

	var streamStartTime, streamRolloverTime, stream;

	/* This will change the variables in-place. */
	var doRollover = function doRollover() {
		if(stream != null) {
			stream.destroy();
			debug("Closing log for " + streamStartTime.format(options.dateFormat));
		}

		streamStartTime = _roundMoment(moment(), duration);
		streamRolloverTime = streamStartTime.clone().add(momentDuration);

		debug("Opening log for " + streamStartTime.format(options.dateFormat));
		stream = _makeStream(streamStartTime, options);

		fakeStream.end = stream.end.bind(stream);
	}

	/* Initial stream setup. */
	doRollover();

	fakeStream.write = function fakeStreamWrite(chunk, encoding) {
		/* Using !.isBefore instead of .isAfter, for a more precise rollover. */
		if(!(moment().isBefore(streamRolloverTime))) {
			doRollover();
		}

		stream.write(chunk, encoding);
	}.bind(this);

	return fakeStream;
}

module.exports = FileStreamRotator;
