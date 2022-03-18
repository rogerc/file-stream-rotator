import { WriteStream, WriteFileOptions } from "fs";

export type StreamOptions = {
    filename: string;
    frequency?: string;
    verbose?: boolean;
    date_format?: string;
    size?: string;
    audit_file?: string;
    end_stream?: boolean;
    file_options?: WriteFileOptions;
    utc?: boolean;
    extension?: string;
    watch_log?: boolean;
    create_symlink?: boolean;
    symlink_name?: string;
    audit_hash_type?: "md5" | "sha256";
};

export function getStream(options: StreamOptions): WriteStream;