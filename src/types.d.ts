import { KeepLogFiles, Frequency } from "./enums"

export type  KeepSettings = {
    type?: KeepLogFiles
    amount?: number
}

export type AuditSettings = {
    keepSettings?: KeepSettings
    auditFilename?: string
    hashType: string
    extension: string
    files: Array<AuditEntry>
}

export type RotationSettings = {
    filename: string
    frequency: Frequency
    amount?: number
    maxSize?: number
    format?: string
    utc: boolean
    extension?: string
    getDateString(date?: Date): string
}

export type FileOptions = {
    flags?: string
    encoding?: string
    mode?: number
    autoClose?: boolean
    emitClose?: boolean
}

export type FileStreamRotatorOptions = {
    /** Filename including full path used by the stream */
    filename: string
    /** 
     * How often to rotate. Options are '*daily*' for daily rotation, '*date*' based on *date_format*, '*[1-12]h*' to rotate every 1-12 hours, 
     * '*[1-30]m*' to rotate every 1-30 minutes.                     
     */
    frequency?: string
    /** If set, it will use console.log to provide extra information when events happen. Default is false  */
    verbose?: boolean
    /**
     * Use 'Y' for full year, 'M' for month, 'D' for day, 'H' for hour, 'm' for minutes, 's' for seconds
     * If using '*date*' frequency, it is used to trigger file change when the string representation changes.
     * It will be used to replace %DATE% in the filename. All replacements are numeric only.
     */
    date_format?: string
    /** 
     * Max size of the file after which it will rotate. It can be combined with frequency or date format.
     * The size units are 'k', 'm' and 'g'. Units need to directly follow a number e.g. 1g, 100m, 20k.
     */
    size?: string
    /**
     * Max number of logs to keep. If not set, it won't remove past logs. It uses its own log audit file
     * to keep track of the log files in a json format. It won't delete any file not contained in it.
     * It can be a number of files or number of days. If using days, add 'd' as the suffix. e.g., '10d' for 10 days.
     */
    max_logs?: string;
    /** Location to store the log audit file. If not set, it will be stored in the root of the application. */
    audit_file?: string
    /**
     * End stream (true) instead of the default behaviour of destroy (false). Set value to true if when writing to the
     * stream in a loop, if the application terminates or log rotates, data pending to be flushed might be lost.
     */
    end_stream?: boolean
    /**
     * An object passed to the stream. This can be used to specify flags, encoding, and mode.
     * See https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options. Default `{ flags: 'a' }`.
     */
    file_options?: FileOptions
    /** Use UTC time for date in filename. Defaults to 'false' */
    utc?: boolean
    /**
     * File extension to be appended to the filename. This is useful when using size restrictions as the rotation
     * adds a count (1,2,3,4,...) at the end of the filename when the required size is met.
     */
    extension?: string

    // watch_log?: boolean
    /**
     * Create a tailable symlink to the current active log file. Defaults to 'false'
     */
    create_symlink?: boolean
    /**
     * Name to use when creating the symbolic link. Defaults to 'current.log'
     */
    symlink_name?: string
    /** Use specified hashing algorithm for audit. Defaults to 'md5'. Use 'sha256' for FIPS compliance. */
    audit_hash_type?: "md5" | "sha256"

    /** use this to define your filename with date */
    getDateString?: (date?: Date) => string
}

export type FileStreamRotatorConfig = {
    options?: FileStreamRotatorOptions
    auditSettings?: AuditSettings
    fileOptions?: FileOptions
    rotationSettings?: RotationSettings
}

export type NumberAlphaParam = {
    number: number
    letter?: string
}


export type DateComponents = {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
    utc: boolean
    source: Date
}

export type AuditConfigFile = {
    keep: {
        type: KeepLogFiles,
        amount: number
    },
    auditLog: string,
    files: Array<AuditEntry>,
    hashType: string,
    extension: string
}

export type AuditEntry = {
    date: number,
    name: string,
    hash: string
}