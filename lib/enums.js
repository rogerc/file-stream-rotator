"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frequency = exports.KeepLogFiles = void 0;
var KeepLogFiles;
(function (KeepLogFiles) {
    KeepLogFiles[KeepLogFiles["days"] = 1] = "days";
    KeepLogFiles[KeepLogFiles["fileCount"] = 2] = "fileCount";
})(KeepLogFiles = exports.KeepLogFiles || (exports.KeepLogFiles = {}));
var Frequency;
(function (Frequency) {
    Frequency[Frequency["daily"] = 1] = "daily";
    Frequency[Frequency["minutes"] = 2] = "minutes";
    Frequency[Frequency["hours"] = 3] = "hours";
    Frequency[Frequency["date"] = 4] = "date";
    Frequency[Frequency["none"] = 5] = "none";
    // test
})(Frequency = exports.Frequency || (exports.Frequency = {}));
