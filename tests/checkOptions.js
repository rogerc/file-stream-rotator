"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
exports.__esModule = true;
var node_assert_1 = __importDefault(require("node:assert"));
var enums_1 = require("../lib/enums");
var test;
// Default date added at the end of the file
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/1/test.log", frequency: "daily", verbose: false });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.daily);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMD");
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 0, 0)) == "20221028", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 0, 0)), " != \"20221028\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/1/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/1/test.log." + test.rotator.getDateString()));
// Default date added using file pattern
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/2/test-%DATE%.log", frequency: "daily", verbose: false });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.daily);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMD");
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 0, 0)) == "20221028", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 0, 0)), " != \"20221028\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/2/test-" + test.rotator.getDateString() + ".log", "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/2/test-" + test.rotator.getDateString() + ".log"));
// Custom date added using file pattern using date format
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/3/test-%DATE%.log", frequency: "daily", verbose: false, date_format: "YYYY-MM-DD" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.daily);
(0, node_assert_1["default"])(test.rotator.settings.format == "YYYY-MM-DD");
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 0, 0)) == "2022-10-28", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 0, 0)), " != \"2022-10-28\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/3/test-" + test.rotator.getDateString() + ".log", "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/3/test-" + test.rotator.getDateString() + ".log"));
// Rotate when the date format is different (e.g monthly) using Y (Year), M (Month) replacements
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/4/test-%DATE%.log", frequency: "date", verbose: false, date_format: "YYYY-MM" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.date);
(0, node_assert_1["default"])(test.rotator.settings.format == "YYYY-MM");
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 0, 0)) == "2022-10", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 0, 0)), " != \"2022-10\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/4/test-" + test.rotator.getDateString() + ".log", "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/4/test-" + test.rotator.getDateString() + ".log"));
// Rotate when the date format is different (e.g AM/PM) using Y (Year), M (Month), D (Day), A (AM/PM) replacements
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/5/test-%DATE%.log", frequency: "custom", verbose: false, date_format: "YYYY-MM-DD-A" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.date);
(0, node_assert_1["default"])(test.rotator.settings.format == "YYYY-MM-DD-A");
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 0, 0)) == "2022-10-28-PM", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 0, 0)), " != \"2022-10-28-PM\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/5/test-" + test.rotator.getDateString() + ".log", "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/5/test-" + test.rotator.getDateString() + ".log"));
// Rotate on given minutes using the 'm' option i.e. 5m or 30m
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/6/test.log", frequency: "5m", verbose: false });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.minutes);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 5);
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 6, 0)) == "202210281205", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 6, 0)), " != \"202210281205\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/6/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/6/test.log." + test.rotator.getDateString()));
// Rotate on the hour or any specified number of hours
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/7/test.log", frequency: "1h", verbose: false });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.hours);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 1);
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 13, 6, 0)) == "202210281300", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 13, 6, 0)), " != \"202210281300\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/7/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/7/test.log." + test.rotator.getDateString()));
// Rotate on the hour or any specified number of hours and keep 10 files
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/8/test.log", frequency: "1h", verbose: false, max_logs: 10 });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.hours);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 1);
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 13, 6, 0)) == "202210281300", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 13, 6, 0)), " != \"202210281300\""));
(0, node_assert_1["default"])(((_b = (_a = test.config.auditSettings) === null || _a === void 0 ? void 0 : _a.keepSettings) === null || _b === void 0 ? void 0 : _b.amount) == 10);
(0, node_assert_1["default"])(((_d = (_c = test.config.auditSettings) === null || _c === void 0 ? void 0 : _c.keepSettings) === null || _d === void 0 ? void 0 : _d.type) == enums_1.KeepLogFiles.fileCount);
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/8/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/8/test.log." + test.rotator.getDateString()));
// Rotate on the hour or any specified number of hours and keep 10 days
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/9/test.log", frequency: "1h", verbose: false, max_logs: "10d" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.hours);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 1);
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 13, 6, 0)) == "202210281300", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 13, 6, 0)), " != \"202210281300\""));
(0, node_assert_1["default"])(((_f = (_e = test.config.auditSettings) === null || _e === void 0 ? void 0 : _e.keepSettings) === null || _f === void 0 ? void 0 : _f.amount) == 10);
(0, node_assert_1["default"])(((_h = (_g = test.config.auditSettings) === null || _g === void 0 ? void 0 : _g.keepSettings) === null || _h === void 0 ? void 0 : _h.type) == enums_1.KeepLogFiles.days);
(0, node_assert_1["default"])(((_j = test.config.auditSettings) === null || _j === void 0 ? void 0 : _j.auditFilename) == "audit.json");
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/9/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/9/test.log." + test.rotator.getDateString()));
// Rotate on the hour or any specified number of hours and keep 10 days and store the audit file in /tmp/log-audit.json
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/10/test.log", frequency: "1h", verbose: false, max_logs: "10d", audit_file: "/tmp/testlog/10/log-audit.json" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.hours);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 1);
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 13, 6, 0)) == "202210281300", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 13, 6, 0)), " != \"202210281300\""));
(0, node_assert_1["default"])(((_l = (_k = test.config.auditSettings) === null || _k === void 0 ? void 0 : _k.keepSettings) === null || _l === void 0 ? void 0 : _l.amount) == 10);
(0, node_assert_1["default"])(((_o = (_m = test.config.auditSettings) === null || _m === void 0 ? void 0 : _m.keepSettings) === null || _o === void 0 ? void 0 : _o.type) == enums_1.KeepLogFiles.days);
(0, node_assert_1["default"])(((_p = test.config.auditSettings) === null || _p === void 0 ? void 0 : _p.auditFilename) == "/tmp/testlog/10/log-audit.json");
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/10/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/10/test.log." + test.rotator.getDateString()));
// Rotate by file size only without date included in the name. Iteration will be added at the end.
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/11/logfile", size: "50k", max_logs: "5", audit_file: "/tmp/testlog/11/audit.json" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.none);
(0, node_assert_1["default"])(test.rotator.settings.format == undefined);
(0, node_assert_1["default"])(test.rotator.settings.maxSize == 50 * 1024);
(0, node_assert_1["default"])(((_r = (_q = test.config.auditSettings) === null || _q === void 0 ? void 0 : _q.keepSettings) === null || _r === void 0 ? void 0 : _r.amount) == 5);
(0, node_assert_1["default"])(((_t = (_s = test.config.auditSettings) === null || _s === void 0 ? void 0 : _s.keepSettings) === null || _t === void 0 ? void 0 : _t.type) == enums_1.KeepLogFiles.fileCount);
(0, node_assert_1["default"])(((_u = test.config.auditSettings) === null || _u === void 0 ? void 0 : _u.auditFilename) == "/tmp/testlog/11/audit.json");
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/11/logfile.0", "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/11/logfile.0"));
// Rotate by file size only without date included in the name. Rotation added before the extension.
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/12/logfile", size: "50k", max_logs: "5", audit_file: "/tmp/testlog/12/logaudit.json", extension: ".log" });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.none);
(0, node_assert_1["default"])(test.rotator.settings.format == undefined);
(0, node_assert_1["default"])(test.rotator.settings.maxSize == 50 * 1024);
(0, node_assert_1["default"])(((_w = (_v = test.config.auditSettings) === null || _v === void 0 ? void 0 : _v.keepSettings) === null || _w === void 0 ? void 0 : _w.amount) == 5);
(0, node_assert_1["default"])(((_y = (_x = test.config.auditSettings) === null || _x === void 0 ? void 0 : _x.keepSettings) === null || _y === void 0 ? void 0 : _y.type) == enums_1.KeepLogFiles.fileCount);
(0, node_assert_1["default"])(((_z = test.config.auditSettings) === null || _z === void 0 ? void 0 : _z.auditFilename) == "/tmp/testlog/12/logaudit.json");
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/12/logfile.0.log", "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/12/logfile.0.log"));
// Rotate every 12 (14 proided) hours or any specified number of hours and keep 10 files
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/13/test.log", frequency: "14h", verbose: false, max_logs: 10 });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.hours);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 12, "".concat(test.rotator.settings.amount, " != 12"));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 13, 6, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 28, 13, 6, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 11, 6, 0)) == "202210280000", "".concat(test.rotator.getDateString(new Date(2022, 9, 28, 11, 6, 0)), " != \"202210280000\""));
(0, node_assert_1["default"])(((_1 = (_0 = test.config.auditSettings) === null || _0 === void 0 ? void 0 : _0.keepSettings) === null || _1 === void 0 ? void 0 : _1.amount) == 10);
(0, node_assert_1["default"])(((_3 = (_2 = test.config.auditSettings) === null || _2 === void 0 ? void 0 : _2.keepSettings) === null || _3 === void 0 ? void 0 : _3.type) == enums_1.KeepLogFiles.fileCount);
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/13/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/13/test.log." + test.rotator.getDateString()));
// Rotate on given minutes using the 'm' option i.e. 5m or 30m
var rotatingLogStream = require('../lib').getStream({ filename: "/tmp/testlog/14/test.log", frequency: "35m", verbose: false });
test = rotatingLogStream.test();
(0, node_assert_1["default"])(test.rotator.settings.frequency == enums_1.Frequency.minutes);
(0, node_assert_1["default"])(test.rotator.settings.format == "YMDHm");
(0, node_assert_1["default"])(test.rotator.settings.amount == 30);
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 2, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 2, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 6, 0)) == "202210281200", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 6, 0)), " != \"202210281200\""));
(0, node_assert_1["default"])(test.rotator.getDateString(new Date(2022, 9, 28, 12, 36, 0)) == "202210281230", "".concat(test.rotator.getDateString(new Date(2022, 9, 29, 12, 36, 0)), " != \"202210281230\""));
(0, node_assert_1["default"])(test.rotator.getNewFilename() == "/tmp/testlog/14/test.log." + test.rotator.getDateString(), "".concat(test.rotator.getNewFilename(), " != ").concat("/tmp/testlog/14/test.log." + test.rotator.getDateString()));
