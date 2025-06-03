"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStreamAndMetadata = exports.getFileStream = void 0;
const stream_1 = require("stream");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const fs_2 = require("fs");
const promises_1 = require("stream/promises");
/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content
 */
async function getFileStream(pathOrUrl) {
    if (isUrl(pathOrUrl)) {
        const response = await fetch(pathOrUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${pathOrUrl}: ${response.status} ${response.statusText}`);
        }
        return stream_1.Readable.fromWeb(response.body);
    }
    else {
        // Check if file exists first (this will throw if file doesn't exist)
        await fs_1.promises.stat(pathOrUrl);
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
async function getLocalFileStreamAndMetadata(filePath) {
    const stats = await fs_1.promises.stat(filePath);
    const metadata = {
        size: stats.size,
        lastModified: stats.mtime,
        name: filePath.split("/").pop() || filePath.split("\\").pop(),
    };
    const stream = fs_1.createReadStream(filePath);
    return {
        stream,
        metadata,
    };
}
async function getRemoteFileStreamAndMetadata(url) {
    const response = await fetch(url);
    if (!response.ok) {
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
    const tempFileName = `file-stream-${Date.now()}-${Math.random().toString(36)
        .substring(2)}`;
    const tempFilePath = path_1.join(os_1.tmpdir(), tempFileName);
    // Download to temporary file
    const fileStream = fs_2.createWriteStream(tempFilePath);
    const webStream = stream_1.Readable.fromWeb(response.body);
    await promises_1.pipeline(webStream, fileStream);
    // Get file stats
    const stats = await fs_1.promises.stat(tempFilePath);
    const metadata = {
        ...baseMetadata,
        size: stats.size,
    };
    // Create a readable stream that cleans up the temp file when done
    const stream = fs_1.createReadStream(tempFilePath);
    // Clean up temp file when stream is closed or ends
    const cleanup = async () => {
        try {
            await fs_1.promises.unlink(tempFilePath);
        }
        catch (_a) {
            // Ignore cleanup errors (file might already be deleted)
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
