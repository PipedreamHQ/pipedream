import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import {
  createReadStream, createWriteStream, promises as fs, Stats,
} from "fs";
import { tmpdir } from "os";
import {
  join, basename,
} from "path";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";
import * as mime from "mime-types";

export interface FileMetadata {
  size?: number;
  contentType?: string;
  lastModified?: Date;
  name?: string;
  etag?: string;
}

/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content
 */
export async function getFileStream(pathOrUrl: string): Promise<Readable> {
  if (isUrl(pathOrUrl)) {
    const response = await fetch(pathOrUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch ${pathOrUrl}: ${response.status} ${response.statusText}`);
    }
    return Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  } else {
    await safeStat(pathOrUrl);
    return createReadStream(pathOrUrl);
  }
}

/**
 * @param pathOrUrl - a file path or a URL
 * @returns a Readable stream of the file content and its metadata
 */
export async function getFileStreamAndMetadata(pathOrUrl: string): Promise<{ stream: Readable; metadata: FileMetadata }> {
  if (isUrl(pathOrUrl)) {
    return await getRemoteFileStreamAndMetadata(pathOrUrl);
  } else {
    return await getLocalFileStreamAndMetadata(pathOrUrl);
  }
}

function isUrl(pathOrUrl: string): boolean {
  try {
    new URL(pathOrUrl);
    return true;
  } catch {
    return false;
  }
}

async function safeStat(path: string): Promise<Stats> {
  try {
    return await fs.stat(path);
  } catch {
    throw new Error(`File not found: ${path}`);
  }
}

async function getLocalFileStreamAndMetadata(
  filePath: string,
): Promise<{ stream: Readable; metadata: FileMetadata }> {
  const stats = await safeStat(filePath);
  const contentType = mime.lookup(filePath) || undefined;
  const metadata: FileMetadata = {
    size: stats.size,
    lastModified: stats.mtime,
    name: basename(filePath),
    contentType,
  };
  const stream = createReadStream(filePath);
  return {
    stream,
    metadata,
  };
}

async function getRemoteFileStreamAndMetadata(url: string): Promise<{ stream: Readable; metadata: FileMetadata }> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const headers = response.headers;
  const contentLength = headers.get("content-length");
  const contentType = headers.get("content-type") || undefined;
  const lastModified = headers.get("last-modified")
    ? new Date(headers.get("last-modified")!)
    : undefined;
  const etag = headers.get("etag") || undefined;
  const urlObj = new URL(url);
  const name = urlObj.pathname.split("/").pop() || undefined;

  const baseMetadata: FileMetadata = {
    contentType,
    lastModified,
    name,
    etag,
  };

  // If we have content-length, we can stream directly
  if (contentLength) {
    const metadata: FileMetadata = {
      ...baseMetadata,
      size: parseInt(contentLength, 10),
    };
    const stream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
    return {
      stream,
      metadata,
    };
  }

  // No content-length header - need to download to temporary file to get size
  return await downloadToTemporaryFile(response, baseMetadata);
}

async function downloadToTemporaryFile(response: Response, baseMetadata: FileMetadata): Promise<{ stream: Readable; metadata: FileMetadata }> {
  // Generate unique temporary file path
  const tempFileName = `file-stream-${uuidv4()}`;
  const tempFilePath = join(tmpdir(), tempFileName);
  // Download to temporary file
  const fileStream = createWriteStream(tempFilePath);
  const webStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  try {
    await pipeline(webStream, fileStream);
    const stats = await fs.stat(tempFilePath);
    const metadata: FileMetadata = {
      ...baseMetadata,
      size: stats.size,
    };
    const stream = createReadStream(tempFilePath);

    const cleanup = async () => {
      try {
        await fs.unlink(tempFilePath);
      } catch {
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
  } catch (err) {
    // Cleanup on error
    try { await fs.unlink(tempFilePath); } catch {
      // Ignore cleanup errors
    }
    throw err;
  }
}
