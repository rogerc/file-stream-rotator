import type { AuditSettings, FileOptions, FileStreamRotatorOptions, NumberAlphaParam, RotationSettings } from "./types";
export default class DefaultOptions {
    static letter: any;
    static number: number | undefined;
    static fileStreamRotatorOptions(options: Partial<FileStreamRotatorOptions>): FileStreamRotatorOptions;
    static fileOptions(options: Partial<FileOptions>): FileOptions;
    static auditSettings(options: Partial<AuditSettings>): AuditSettings;
    static rotationSettings(options: Partial<RotationSettings>): RotationSettings;
    static extractParam(param: string, lowercase?: boolean): NumberAlphaParam;
}
