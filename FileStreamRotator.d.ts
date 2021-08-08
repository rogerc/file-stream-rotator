interface FileStreamRotator {
    getFrequency(frequency:string): any
    getDate(format: string, dateFormat: string): any
    getStream(options:Object):any
}

declare module 'file-stream-rotator' {
    const FileStreamRotator: FileStreamRotator;
    export = FileStreamRotator;
}
