import type { AuditSettings, FileOptions, FileStreamRotatorOptions, NumberAlphaParam, RotationSettings } from "./types"
import { KeepLogFiles, Frequency } from "./enums"

export default class DefaultOptions {
    static letter: any
    static number: number | undefined
    static fileStreamRotatorOptions(options: Partial<FileStreamRotatorOptions>): FileStreamRotatorOptions {
        let defaults: FileStreamRotatorOptions = {
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
        }
        // console.log(defaults, options)
        return {...defaults, ...options}
    }

    static fileOptions(options: Partial<FileOptions>): FileOptions {
        let defaults: FileOptions = {
            flags: "a"
        }
        return {...defaults, ...options}
    }

    static auditSettings(options: Partial<AuditSettings>): AuditSettings {
        let defaults: AuditSettings = {
            keepSettings: {type: KeepLogFiles.fileCount, amount: 10},
            auditFilename: "audit.json",
            hashType: "md5",
            extension: "",
            files: []
        }

        return {...defaults, ...options}
    }

    static rotationSettings(options: Partial<RotationSettings>): RotationSettings {
        let defaults: RotationSettings = {
            filename: "",
            // format: "YYYYMMDD",
            frequency: Frequency.none,
            utc: false
        }
        return {...defaults, ...options}
    }

    static extractParam(param: string, lowercase: boolean = true): NumberAlphaParam {
        let letter = param.toString().match(/(\w)$/);
        let rtn: NumberAlphaParam = {number:0}
        if (letter?.length == 2) {
            rtn.letter = letter[1].toLowerCase()
        }
        let _num = param.toString().match(/^(\d+)/);
        if (_num?.length == 2) {
            rtn.number = Number(_num[1])
        }
        return rtn
    }
    
}
