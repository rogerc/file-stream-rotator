"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class DefaultOptions {
    static fileStreamRotatorOptions(options) {
        let defaults = {
            filename: "",
            // frequency: "daily",
            verbose: false,
            // date_format: "YYYYMMDD",
            end_stream: false,
            // file_options: {flags: "a"},
            utc: false,
            // watch_log: false,
            create_symlink: false,
            symlink_name: "current.log",
            // audit_hash_type: "md5"
        };
        // console.log(defaults, options)
        return Object.assign(Object.assign({}, defaults), options);
    }
    static fileOptions(options) {
        let defaults = {
            flags: "a"
        };
        return Object.assign(Object.assign({}, defaults), options);
    }
    static auditSettings(options) {
        let defaults = {
            keepSettings: { type: enums_1.KeepLogFiles.fileCount, amount: 10 },
            auditFilename: "audit.json",
            hashType: "md5",
            extension: "",
            files: []
        };
        return Object.assign(Object.assign({}, defaults), options);
    }
    static rotationSettings(options) {
        let defaults = {
            filename: "",
            // format: "YYYYMMDD",
            frequency: enums_1.Frequency.none,
            utc: false
        };
        return Object.assign(Object.assign({}, defaults), options);
    }
    static extractParam(param, lowercase = true) {
        let letter = param.toString().match(/(\w)$/);
        let rtn = { number: 0 };
        if ((letter === null || letter === void 0 ? void 0 : letter.length) == 2) {
            rtn.letter = letter[1].toLowerCase();
        }
        let _num = param.toString().match(/^(\d+)/);
        if ((_num === null || _num === void 0 ? void 0 : _num.length) == 2) {
            rtn.number = Number(_num[1]);
        }
        return rtn;
    }
}
exports.default = DefaultOptions;
