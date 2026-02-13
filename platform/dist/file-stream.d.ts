import { Readable } from "stream";
export interface FileMetadata {
    size: number;
    contentType?: string;
    lastModified?: Date;
    name?: string;
    etag?: string;
}
/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content
 */
export declare function getFileStream(pathOrUrl: string): Promise<Readable>;
/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content and its metadata
 */
export declare function getFileStreamAndMetadata(pathOrUrl: string): Promise<{
    stream: Readable;
    metadata: FileMetadata;
}>;
