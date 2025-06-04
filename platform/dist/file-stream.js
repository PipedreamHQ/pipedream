"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStreamAndMetadata = exports.getFileStream = void 0;
const stream_1 = require("stream");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const promises_1 = require("stream/promises");
const uuid_1 = require("uuid");
const mime = require("mime-types");
/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content
 */
async function getFileStream(pathOrUrl) {
    if (isUrl(pathOrUrl)) {
        const response = await fetch(pathOrUrl);
        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch ${pathOrUrl}: ${response.status} ${response.statusText}`);
        }
        return stream_1.Readable.fromWeb(response.body);
    }
    else {
        await safeStat(pathOrUrl);
        return fs_1.createReadStream(pathOrUrl);
    }
}
exports.getFileStream = getFileStream;
/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content and its metadata
 */
async function getFileStreamAndMetadata(pathOrUrl) {
    if (isUrl(pathOrUrl)) {
        return await getRemoteFileStreamAndMetadata(pathOrUrl);
    }
    else {
        return await getLocalFileStreamAndMetadata(pathOrUrl);
    }
}
exports.getFileStreamAndMetadata = getFileStreamAndMetadata;
function isUrl(pathOrUrl) {
    try {
        new URL(pathOrUrl);
        return true;
    }
    catch (_a) {
        return false;
    }
}
async function safeStat(path) {
    try {
        return await fs_1.promises.stat(path);
    }
    catch (_a) {
        throw new Error(`File not found: ${path}`);
    }
}
async function getLocalFileStreamAndMetadata(filePath) {
    const stats = await safeStat(filePath);
    const contentType = mime.lookup(filePath) || undefined;
    const metadata = {
        size: stats.size,
        lastModified: stats.mtime,
        name: path_1.basename(filePath),
        contentType,
    };
    const stream = fs_1.createReadStream(filePath);
    return {
        stream,
        metadata,
    };
}
async function getRemoteFileStreamAndMetadata(url) {
    const response = await fetch(url);
    if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const headers = response.headers;
    const contentLength = headers.get("content-length");
    const contentType = headers.get("content-type") || undefined;
    const lastModified = headers.get("last-modified")
        ? new Date(headers.get("last-modified"))
        : undefined;
    const etag = headers.get("etag") || undefined;
    const urlObj = new URL(url);
    const name = urlObj.pathname.split("/").pop() || undefined;
    const baseMetadata = {
        contentType,
        lastModified,
        name,
        etag,
    };
    // If we have content-length, we can stream directly
    if (contentLength) {
        const metadata = {
            ...baseMetadata,
            size: parseInt(contentLength, 10),
        };
        const stream = stream_1.Readable.fromWeb(response.body);
        return {
            stream,
            metadata,
        };
    }
    // No content-length header - need to download to temporary file to get size
    return await downloadToTemporaryFile(response, baseMetadata);
}
async function downloadToTemporaryFile(response, baseMetadata) {
    // Generate unique temporary file path
    const tempFileName = `file-stream-${uuid_1.v4()}`;
    const tempFilePath = path_1.join(os_1.tmpdir(), tempFileName);
    // Download to temporary file
    const fileStream = fs_1.createWriteStream(tempFilePath);
    const webStream = stream_1.Readable.fromWeb(response.body);
    try {
        await promises_1.pipeline(webStream, fileStream);
        const stats = await fs_1.promises.stat(tempFilePath);
        const metadata = {
            ...baseMetadata,
            size: stats.size,
        };
        const stream = fs_1.createReadStream(tempFilePath);
        const cleanup = async () => {
            try {
                await fs_1.promises.unlink(tempFilePath);
            }
            catch (_a) {
                // Ignore cleanup errors
            }
        };
        stream.on("close", cleanup);
        stream.on("end", cleanup);
        stream.on("error", cleanup);
        return {
            stream,
            metadata,
        };
    }
    catch (err) {
        // Cleanup on error
        try {
            await fs_1.promises.unlink(tempFilePath);
        }
        catch (_a) {
            // Ignore cleanup errors
        }
        throw err;
    }
}
