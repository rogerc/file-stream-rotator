"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const enums_1 = require("./enums");
const helper_1 = require("./helper");
// import { format } from 'date-fns'
class Rotator {
    constructor(settings, lastEntry) {
        var _a;
        this.currentSize = 0;
        this.lastDate = "";
        this.fileIndx = 0;
        this.settings = settings;
        // if (!this.settings.format) {
        //     this.settings.frequency = Frequency.none
        //     Logger.log("[FileStreamRotator] Changing type to none as date format is missing");
        //     return
        // }
        switch (this.settings.frequency) {
            case enums_1.Frequency.hours:
                if (!(this.settings.amount && this.settings.amount < 13)) {
                    this.settings.amount = 12;
                }
                else if (!(this.settings.amount && this.settings.amount > 0)) {
                    this.settings.amount = 1;
                }
                if (!this.isFormatValidForHour()) {
                    // Logger.log(`[FileStreamRotator] Changing type to none as date format does not change every ${this.settings.amount} hours`);
                    helper_1.Logger.log("Date format not suitable for X hours rotation. Changing date format to 'YMDHm'");
                    this.settings.format = "YMDHm";
                    // this.settings.frequency = Frequency.none
                }
                break;
            case enums_1.Frequency.minutes:
                if (!(this.settings.amount && this.settings.amount < 31)) {
                    this.settings.amount = 30;
                }
                else if (!(this.settings.amount && this.settings.amount > 0)) {
                    this.settings.amount = 1;
                }
                if (!this.isFormatValidForMinutes()) {
                    this.settings.format = "YMDHm";
                    helper_1.Logger.log("Date format not suitable for X minutes rotation. Changing date format to 'YMDHm'");
                    // Logger.log(`[FileStreamRotator] Changing type to none as date format does not change every ${this.settings.amount} minutes`);                    
                    // this.settings.frequency = Frequency.none
                }
                break;
            case enums_1.Frequency.daily:
                if (!this.isFormatValidForDaily()) {
                    this.settings.format = "YMD";
                    helper_1.Logger.log("Date format not suitable for daily rotation. Changing date format to 'YMD'");
                    // Logger.log('[FileStreamRotator] Changing type to custom as date format changes more often than once a day or not every day');
                    // this.settings.frequency = Frequency.date
                }
                break;
        }
        if (this.settings.frequency !== enums_1.Frequency.none && !this.settings.filename.match("%DATE%")) {
            this.settings.filename += ".%DATE%";
            helper_1.Logger.log(`Appending date to the end of the filename`);
        }
        // if (this.settings.maxSize && lastEntry){
        //     let date = new Date(lastEntry.date)
        //     let extension = this.settings.extension ?? ""
        //     Logger.debug(this.getDateString(date) == this.getDateString(new Date()), this.getDateString(date), this.getDateString(new Date()))
        //     if (this.getDateString(date) == this.getDateString(new Date())){                    
        //         let indx = lastEntry.name.match(RegExp("(\\d+)" + extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
        //         if (indx) {
        //             this.fileIndx = Number(indx)
        //         }
        //         Logger.debug("index found", indx, RegExp("(\\d+)" + extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), lastEntry)
        //         var lastEntryFileStats = fs.statSync(lastEntry.name);
        //         if (lastEntryFileStats.size < this.settings.maxSize) {
        //             this.currentSize = lastEntryFileStats.size
        //         } else {
        //             this.fileIndx += 1
        //         }
        //     }
        // }
        this.lastDate = this.getDateString();
        if (this.settings.maxSize && lastEntry) {
            let date = new Date(lastEntry.date);
            let extension = (_a = this.settings.extension) !== null && _a !== void 0 ? _a : "";
            helper_1.Logger.debug(this.getDateString(date) == this.getDateString(new Date()), this.getDateString(date), this.getDateString(new Date()));
            if (this.getDateString(date) == this.getDateString(new Date())) {
                let indx = lastEntry.name.match(RegExp("(\\d+)" + extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
                if (indx) {
                    this.fileIndx = Number(indx[1]);
                }
                // Logger.debug("index found", indx, RegExp("(\\d+)" + extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), lastEntry)
                var fileSize = this.getSizeForFile(this.getNewFilename());
                if (fileSize) {
                    this.currentSize = fileSize;
                }
                this.lastDate = this.getDateString(date);
                helper_1.Logger.debug("LOADED LAST ENTRY", this.currentSize, this.lastDate, this.fileIndx);
            }
            else {
                var fileSize = this.getSizeForFile(this.getNewFilename());
                if (fileSize) {
                    this.currentSize = fileSize;
                }
                helper_1.Logger.debug("CURRENT FILE:", this.getNewFilename(), this.currentSize);
            }
        }
    }
    getSizeForFile(file) {
        try {
            if (fs.existsSync(file)) {
                var fileStats = fs.statSync(this.getNewFilename());
                if (fileStats) {
                    return fileStats.size;
                }
            }
        }
        catch (error) {
            return undefined;
        }
        return undefined;
    }
    hasMaxSizeReached() {
        return this.settings.maxSize ? this.currentSize > this.settings.maxSize : false;
    }
    shouldRotate() {
        let rotateBySize = this.hasMaxSizeReached();
        switch (this.settings.frequency) {
            case enums_1.Frequency.none:
                return rotateBySize;
            case enums_1.Frequency.hours:
            case enums_1.Frequency.minutes:
            case enums_1.Frequency.date:
            case enums_1.Frequency.daily:
            default:
                let newDate = this.getDateString();
                // console.log(">>>", this.lastDate != newDate, this.lastDate, newDate, rotateBySize, this.currentSize)
                if (this.lastDate != newDate) {
                    return true;
                }
                else {
                    return rotateBySize;
                }
        }
        // return false
    }
    isFormatValidForDaily() {
        let date1 = new Date(2022, 2, 20, 1, 2, 3);
        let date2 = new Date(2022, 2, 20, 23, 55, 45);
        let date3 = new Date(2022, 2, 21, 2, 55, 45);
        return this.getDateString(date1) === this.getDateString(date2) && this.getDateString(date1) !== this.getDateString(date3);
    }
    isFormatValidForHour() {
        if (!this.settings.amount || this.settings.frequency != enums_1.Frequency.hours) {
            return false;
        }
        let date1 = new Date(2022, 2, 20, 1, 2, 3);
        let date2 = new Date(2022, 2, 20, 2 + this.settings.amount, 55, 45);
        return this.getDateString(date1) !== this.getDateString(date2);
    }
    isFormatValidForMinutes() {
        if (!this.settings.amount || this.settings.frequency != enums_1.Frequency.minutes) {
            return false;
        }
        let date1 = new Date(2022, 2, 20, 1, 2, 3);
        let date2 = new Date(2022, 2, 20, 1, 2 + this.settings.amount, 45);
        return this.getDateString(date1) !== this.getDateString(date2);
    }
    getDateString(date) {
        let _date = date || new Date();
        let components = Rotator.getDateComponents(_date, this.settings.utc);
        let format = this.settings.format;
        if (format) {
            switch (this.settings.frequency) {
                case enums_1.Frequency.hours:
                    if (this.settings.amount) {
                        var hour = Math.floor(components.hour / this.settings.amount) * this.settings.amount;
                        components.hour = hour;
                        components.minute = 0;
                        components.second = 0;
                    }
                case enums_1.Frequency.minutes:
                    if (this.settings.amount) {
                        var minute = Math.floor(components.minute / this.settings.amount) * this.settings.amount;
                        components.minute = minute;
                        components.second = 0;
                    }
            }
            return format === null || format === void 0 ? void 0 : format.replace(/D+/, components.day.toString().padStart(2, "0")).replace(/M+/, components.month.toString().padStart(2, "0")).replace(/Y+/, components.year.toString()).replace(/H+/, components.hour.toString().padStart(2, "0")).replace(/m+/, components.minute.toString().padStart(2, "0")).replace(/s+/, components.second.toString().padStart(2, "0")).replace(/A+/, components.hour > 11 ? "PM" : "AM");
        }
        return "";
    }
    getFilename(name, extension) {
        // console.log(name.replace("%DATE%",this.lastDate) + (this.settings.maxSize ? "." + this.fileIndx : "") + (extension ? extension : ""))
        return name.replace("%DATE%", this.lastDate) + (this.settings.maxSize || this.fileIndx > 0 ? "." + this.fileIndx : "") + (extension ? extension : "");
    }
    getNewFilename() {
        return this.getFilename(this.settings.filename, this.settings.extension);
    }
    addBytes(bytes) {
        this.currentSize += bytes;
    }
    rotate(force = false) {
        // Logger.debug("ROTATE", this.getNewFilename(), this.fileIndx, this.currentSize, this.settings.maxSize)
        if (force) {
            this.fileIndx += 1;
            this.currentSize = 0;
            this.lastDate = this.getDateString();
        }
        else if (this.shouldRotate()) {
            if (this.hasMaxSizeReached()) {
                this.fileIndx += 1;
            }
            else {
                this.fileIndx = 0;
            }
            this.currentSize = 0;
            this.lastDate = this.getDateString();
        }
        // Logger.debug("ROTATE", this.getNewFilename(), this.fileIndx, this.currentSize, this.settings.maxSize)
        return this.getNewFilename();
    }
    static getDateComponents(date, utc) {
        if (utc) {
            return {
                day: date.getUTCDate(),
                month: date.getUTCMonth() + 1,
                year: date.getUTCFullYear(),
                hour: date.getUTCHours(),
                minute: date.getUTCMinutes(),
                second: date.getUTCSeconds(),
                utc: utc,
                source: date
            };
        }
        else {
            return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                utc: utc,
                source: date
            };
        }
    }
    static createDate(components, utc) {
        if (utc) {
            new Date(Date.UTC(components.year, components.month, components.day, components.hour, components.minute, components.second));
        }
        return new Date(components.year, components.month, components.day, components.hour, components.minute, components.second);
    }
}
exports.default = Rotator;
