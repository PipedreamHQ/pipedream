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
    if (isDataUrl(pathOrUrl)) {
        return getDataUrlStream(pathOrUrl);
    }
    else if (isUrl(pathOrUrl)) {
        const response = await fetch(pathOrUrl);
        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch ${pathOrUrl}: ${response.status} ${response.statusText}`);
        }
        return stream_1.Readable.fromWeb(response.body);
    }
    else {
        await safeStat(pathOrUrl);
        return (0, fs_1.createReadStream)(pathOrUrl);
    }
}
exports.getFileStream = getFileStream;
/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content and its metadata
 */
async function getFileStreamAndMetadata(pathOrUrl) {
    if (isDataUrl(pathOrUrl)) {
        return getDataUrlStreamAndMetadata(pathOrUrl);
    }
    else if (isUrl(pathOrUrl)) {
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
function isDataUrl(pathOrUrl) {
    return pathOrUrl.startsWith("data:");
}
function parseDataUrl(dataUrl) {
    // Format: data:[<mediatype>][;base64],<data>
    const match = dataUrl.match(/^data:([^;,]*)?(?:;(base64))?,(.*)$/);
    if (!match) {
        throw new Error("Invalid data URL format");
    }
    const [, mediaType = "text/plain;charset=US-ASCII", base64Flag, data,] = match;
    return {
        mediaType,
        isBase64: base64Flag === "base64",
        data,
    };
}
function getDataUrlStream(dataUrl) {
    const parsed = parseDataUrl(dataUrl);
    const buffer = parsed.isBase64
        ? Buffer.from(parsed.data, "base64")
        : Buffer.from(decodeURIComponent(parsed.data), "utf-8");
    return stream_1.Readable.from(buffer);
}
function getDataUrlStreamAndMetadata(dataUrl) {
    const parsed = parseDataUrl(dataUrl);
    const buffer = parsed.isBase64
        ? Buffer.from(parsed.data, "base64")
        : Buffer.from(decodeURIComponent(parsed.data), "utf-8");
    const ext = mime.extension(parsed.mediaType);
    const name = ext ? `file.${ext}` : "file";
    const metadata = {
        size: buffer.length,
        contentType: parsed.mediaType || undefined,
        name,
    };
    return {
        stream: stream_1.Readable.from(buffer),
        metadata,
    };
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
        name: (0, path_1.basename)(filePath),
        contentType,
    };
    const stream = (0, fs_1.createReadStream)(filePath);
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
    const lastModified = headers.get("last-modified")
        ? new Date(headers.get("last-modified"))
        : undefined;
    const etag = headers.get("etag") || undefined;
    const urlObj = new URL(url);
    const name = (0, path_1.basename)(urlObj.pathname);
    const contentType = headers.get("content-type") || mime.lookup(urlObj.pathname) || undefined;
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
    const tempFileName = `file-stream-${(0, uuid_1.v4)()}`;
    const tempFilePath = (0, path_1.join)((0, os_1.tmpdir)(), tempFileName);
    // Download to temporary file
    const fileStream = (0, fs_1.createWriteStream)(tempFilePath);
    const webStream = stream_1.Readable.fromWeb(response.body);
    try {
        await (0, promises_1.pipeline)(webStream, fileStream);
        const stats = await fs_1.promises.stat(tempFilePath);
        const metadata = {
            ...baseMetadata,
            size: stats.size,
        };
        const stream = (0, fs_1.createReadStream)(tempFilePath);
        const cleanup = async () => {
            try {
                await fs_1.promises.unlink(tempFilePath);
            }
            catch (_a) {
                // Ignore cleanup errors
            }
        };
        stream.once("close", cleanup);
        stream.once("end", cleanup);
        stream.once("error", cleanup);
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
