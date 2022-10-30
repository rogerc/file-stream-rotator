import assert from 'node:assert';
import { Frequency, KeepLogFiles } from '../lib/enums';
import Rotator from '../lib/Rotator';
import { FileStreamRotatorConfig } from '../lib/types';

let test: {config: FileStreamRotatorConfig, rotator: Rotator}

// Default date added at the end of the file
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/1/test.log", frequency:"daily", verbose: false});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.daily)
assert(test.rotator.settings.format == "YMD")
assert(test.rotator.getDateString(new Date(2022,9,28,12,0,0)) == "20221028", `${test.rotator.getDateString(new Date(2022,9,29,12,0,0))} != "20221028"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/1/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/1/test.log." + test.rotator.getDateString()}`)

// Default date added using file pattern
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/2/test-%DATE%.log", frequency:"daily", verbose: false});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.daily)
assert(test.rotator.settings.format == "YMD")
assert(test.rotator.getDateString(new Date(2022,9,28,12,0,0)) == "20221028", `${test.rotator.getDateString(new Date(2022,9,29,12,0,0))} != "20221028"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/2/test-" + test.rotator.getDateString() + ".log", `${test.rotator.getNewFilename()} != ${"/tmp/testlog/2/test-" + test.rotator.getDateString() + ".log"}`)

// Custom date added using file pattern using date format
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/3/test-%DATE%.log", frequency:"daily", verbose: false, date_format: "YYYY-MM-DD"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.daily)
assert(test.rotator.settings.format == "YYYY-MM-DD")
assert(test.rotator.getDateString(new Date(2022,9,28,12,0,0)) == "2022-10-28", `${test.rotator.getDateString(new Date(2022,9,29,12,0,0))} != "2022-10-28"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/3/test-" + test.rotator.getDateString() + ".log", `${test.rotator.getNewFilename()} != ${"/tmp/testlog/3/test-" + test.rotator.getDateString() + ".log"}`)

// Rotate when the date format is different (e.g monthly) using Y (Year), M (Month) replacements
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/4/test-%DATE%.log", frequency:"date", verbose: false, date_format: "YYYY-MM"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.date)
assert(test.rotator.settings.format == "YYYY-MM")
assert(test.rotator.getDateString(new Date(2022,9,28,12,0,0)) == "2022-10", `${test.rotator.getDateString(new Date(2022,9,29,12,0,0))} != "2022-10"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/4/test-" + test.rotator.getDateString() + ".log", `${test.rotator.getNewFilename()} != ${"/tmp/testlog/4/test-" + test.rotator.getDateString() + ".log"}`)


// Rotate when the date format is different (e.g AM/PM) using Y (Year), M (Month), D (Day), A (AM/PM) replacements
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/5/test-%DATE%.log", frequency:"custom", verbose: false, date_format: "YYYY-MM-DD-A"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.date)
assert(test.rotator.settings.format == "YYYY-MM-DD-A")
assert(test.rotator.getDateString(new Date(2022,9,28,12,0,0)) == "2022-10-28-PM", `${test.rotator.getDateString(new Date(2022,9,29,12,0,0))} != "2022-10-28-PM"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/5/test-" + test.rotator.getDateString() + ".log", `${test.rotator.getNewFilename()} != ${"/tmp/testlog/5/test-" + test.rotator.getDateString() + ".log"}`)

// Rotate on given minutes using the 'm' option i.e. 5m or 30m
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/6/test.log", frequency:"5m", verbose: false});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.minutes)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 5)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,12,6,0)) == "202210281205", `${test.rotator.getDateString(new Date(2022,9,29,12,6,0))} != "202210281205"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/6/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/6/test.log." + test.rotator.getDateString()}`)

// Rotate on the hour or any specified number of hours
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/7/test.log", frequency:"1h", verbose: false});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.hours)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 1)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,13,6,0)) == "202210281300", `${test.rotator.getDateString(new Date(2022,9,29,13,6,0))} != "202210281300"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/7/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/7/test.log." + test.rotator.getDateString()}`)

// Rotate on the hour or any specified number of hours and keep 10 files
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/8/test.log", frequency:"1h", verbose: false, max_logs: 10});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.hours)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 1)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,13,6,0)) == "202210281300", `${test.rotator.getDateString(new Date(2022,9,29,13,6,0))} != "202210281300"`)
assert(test.config.auditSettings?.keepSettings?.amount == 10)
assert(test.config.auditSettings?.keepSettings?.type == KeepLogFiles.fileCount)
assert(test.rotator.getNewFilename() == "/tmp/testlog/8/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/8/test.log." + test.rotator.getDateString()}`)


// Rotate on the hour or any specified number of hours and keep 10 days
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/9/test.log", frequency:"1h", verbose: false, max_logs: "10d"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.hours)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 1)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,13,6,0)) == "202210281300", `${test.rotator.getDateString(new Date(2022,9,29,13,6,0))} != "202210281300"`)
assert(test.config.auditSettings?.keepSettings?.amount == 10)
assert(test.config.auditSettings?.keepSettings?.type == KeepLogFiles.days)
assert(test.config.auditSettings?.auditFilename == "audit.json")
assert(test.rotator.getNewFilename() == "/tmp/testlog/9/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/9/test.log." + test.rotator.getDateString()}`)

// Rotate on the hour or any specified number of hours and keep 10 days and store the audit file in /tmp/log-audit.json
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/10/test.log", frequency:"1h", verbose: false, max_logs: "10d", audit_file: "/tmp/testlog/10/log-audit.json"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.hours)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 1)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,13,6,0)) == "202210281300", `${test.rotator.getDateString(new Date(2022,9,29,13,6,0))} != "202210281300"`)
assert(test.config.auditSettings?.keepSettings?.amount == 10)
assert(test.config.auditSettings?.keepSettings?.type == KeepLogFiles.days)
assert(test.config.auditSettings?.auditFilename == "/tmp/testlog/10/log-audit.json")
assert(test.rotator.getNewFilename() == "/tmp/testlog/10/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/10/test.log." + test.rotator.getDateString()}`)

// Rotate by file size only without date included in the name. Iteration will be added at the end.
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/11/logfile", size:"50k", max_logs: "5", audit_file:"/tmp/testlog/11/audit.json"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.none)
assert(test.rotator.settings.format == undefined)
assert(test.rotator.settings.maxSize == 50*1024)
assert(test.config.auditSettings?.keepSettings?.amount == 5)
assert(test.config.auditSettings?.keepSettings?.type == KeepLogFiles.fileCount)
assert(test.config.auditSettings?.auditFilename == "/tmp/testlog/11/audit.json")
assert(test.rotator.getNewFilename() == "/tmp/testlog/11/logfile.0", `${test.rotator.getNewFilename()} != ${"/tmp/testlog/11/logfile.0"}`)

// Rotate by file size only without date included in the name. Rotation added before the extension.
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/12/logfile", size:"50k", max_logs: "5", audit_file:"/tmp/testlog/12/logaudit.json", extension: ".log"});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.none)
assert(test.rotator.settings.format == undefined)
assert(test.rotator.settings.maxSize == 50*1024)
assert(test.config.auditSettings?.keepSettings?.amount == 5)
assert(test.config.auditSettings?.keepSettings?.type == KeepLogFiles.fileCount)
assert(test.config.auditSettings?.auditFilename == "/tmp/testlog/12/logaudit.json")
assert(test.rotator.getNewFilename() == "/tmp/testlog/12/logfile.0.log", `${test.rotator.getNewFilename()} != ${"/tmp/testlog/12/logfile.0.log"}`)

// Rotate every 12 (14 proided) hours or any specified number of hours and keep 10 files
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/13/test.log", frequency:"14h", verbose: false, max_logs: 10});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.hours)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 12, `${test.rotator.settings.amount} != 12`)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,28,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,13,6,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,28,13,6,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,11,6,0)) == "202210280000", `${test.rotator.getDateString(new Date(2022,9,28,11,6,0))} != "202210280000"`)
assert(test.config.auditSettings?.keepSettings?.amount == 10)
assert(test.config.auditSettings?.keepSettings?.type == KeepLogFiles.fileCount)
assert(test.rotator.getNewFilename() == "/tmp/testlog/13/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/13/test.log." + test.rotator.getDateString()}`)

// Rotate on given minutes using the 'm' option i.e. 5m or 30m
var rotatingLogStream = require('../lib').getStream({filename:"/tmp/testlog/14/test.log", frequency:"35m", verbose: false});
test = rotatingLogStream.test()
assert(test.rotator.settings.frequency == Frequency.minutes)
assert(test.rotator.settings.format == "YMDHm")
assert(test.rotator.settings.amount == 30)
assert(test.rotator.getDateString(new Date(2022,9,28,12,2,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,2,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,12,6,0)) == "202210281200", `${test.rotator.getDateString(new Date(2022,9,29,12,6,0))} != "202210281200"`)
assert(test.rotator.getDateString(new Date(2022,9,28,12,36,0)) == "202210281230", `${test.rotator.getDateString(new Date(2022,9,29,12,36,0))} != "202210281230"`)
assert(test.rotator.getNewFilename() == "/tmp/testlog/14/test.log." + test.rotator.getDateString(), `${test.rotator.getNewFilename()} != ${"/tmp/testlog/14/test.log." + test.rotator.getDateString()}`)
