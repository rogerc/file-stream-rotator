import { AuditEntry, DateComponents, RotationSettings } from "./types";
export default class Rotator {
    settings: RotationSettings;
    private currentSize;
    private lastDate;
    private fileIndx;
    constructor(settings: RotationSettings, lastEntry?: AuditEntry);
    private getSizeForFile;
    hasMaxSizeReached(): boolean;
    shouldRotate(): boolean;
    private isFormatValidForDaily;
    private isFormatValidForHour;
    private isFormatValidForMinutes;
    getDateString(date?: Date): string;
    private getFilename;
    getNewFilename(): string;
    addBytes(bytes: number): void;
    rotate(force?: boolean): string;
    static getDateComponents(date: Date, utc: boolean): DateComponents;
    static createDate(components: DateComponents, utc: boolean): Date;
}
