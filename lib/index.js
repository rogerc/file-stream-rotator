"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const FileStreamRotator_1 = require("./FileStreamRotator");
// interface FSRIndex {
//     getStream(options: Partial<FileStreamRotatorOptions>): FileStreamRotator
// }
// export let FSR: FSRIndex = {
//     /**
//      *
//      * @param {FileStreamRotatorOptions} options
//      * @param {string} options.filename
//      * @param {string} options.frequency
//      * @param {string} options.verbose
//      * @param {string} options.date_format
//      * @param {string} options.size
//      * @param {string} options.max_logs
//      * @param {string} options.audit_file
//      * @param {string} options.file_options
//      * @param {string} options.utc
//      * @param {string} options.extension File extension to be added at the end of the filename
//      * @param {string} options.create_symlink
//      * @param {string} options.symlink_name
//      * @param {string} options.audit_hash_type Hash to be used to add to the audit log (md5, sha256)
//      * @returns {Object} stream
//      */
//     getStream(options: Partial<FileStreamRotatorOptions>): FileStreamRotator {
//         return new FileStreamRotator(options)
//     }
// }
function getStream(options) {
    return new FileStreamRotator_1.default(options);
}
exports.getStream = getStream;
// module.exports = FSR
// import { FileOptions, FileStreamRotatorOptions } from "./types";
// import FileStreamRotator from "./FileStreamRotator";
// // interface FSRIndex {
// //     getStream(options: Partial<FileStreamRotatorOptions>): FileStreamRotator;
// // }
// // export declare let FSR: FSRIndex;
// // export {};
// // import type { WriteStream, WriteFileOptions } from "fs";
