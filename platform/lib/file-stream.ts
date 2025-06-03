import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import {
  createReadStream, promises as fs,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

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
    if (!response.ok) {
      throw new Error(`Failed to fetch ${pathOrUrl}: ${response.status} ${response.statusText}`);
    }
    return Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  } else {
    // Check if file exists first (this will throw if file doesn't exist)
    await fs.stat(pathOrUrl);
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

async function getLocalFileStreamAndMetadata(filePath: string): Promise<{ stream: Readable; metadata: FileMetadata }> {
  const stats = await fs.stat(filePath);
  const metadata: FileMetadata = {
    size: stats.size,
    lastModified: stats.mtime,
    name: filePath.split("/").pop() || filePath.split("\\").pop(),
  };
  const stream = createReadStream(filePath);
  return {
    stream,
    metadata,
  };
}

async function getRemoteFileStreamAndMetadata(url: string): Promise<{ stream: Readable; metadata: FileMetadata }> {
  const response = await fetch(url);
  if (!response.ok) {
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
  const tempFileName = `file-stream-${Date.now()}-${Math.random().toString(36)
    .substring(2)}`;
  const tempFilePath = join(tmpdir(), tempFileName);
  // Download to temporary file
  const fileStream = createWriteStream(tempFilePath);
  const webStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  await pipeline(webStream, fileStream);
  // Get file stats
  const stats = await fs.stat(tempFilePath);
  const metadata: FileMetadata = {
    ...baseMetadata,
    size: stats.size,
  };

  // Create a readable stream that cleans up the temp file when done
  const stream = createReadStream(tempFilePath);

  // Clean up temp file when stream is closed or ends
  const cleanup = async () => {
    try {
      await fs.unlink(tempFilePath);
    } catch {
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
