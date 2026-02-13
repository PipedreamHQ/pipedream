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
export async function getFileStream(pathOrUrl: string): Promise<Readable> {
  if (isDataUrl(pathOrUrl)) {
    return getDataUrlStream(pathOrUrl);
  } else if (isUrl(pathOrUrl)) {
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
  if (isDataUrl(pathOrUrl)) {
    return getDataUrlStreamAndMetadata(pathOrUrl);
  } else if (isUrl(pathOrUrl)) {
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

function isDataUrl(pathOrUrl: string): boolean {
  return pathOrUrl.startsWith("data:");
}

interface ParsedDataUrl {
  mediaType: string;
  isBase64: boolean;
  data: string;
  name?: string;
}

function parseDataUrl(dataUrl: string): ParsedDataUrl {
  // Format: data:[<mediatype>][;parameter=value]*[;base64],<data>
  // Examples:
  //   data:image/png;base64,iVBORw0K...
  //   data:image/png;name=file.png;base64,iVBORw0K...
  //   data:text/plain,Hello%20World
  const match = dataUrl.match(/^data:([^;,]*)?(?:;([^,]*))?,([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }
  const [
    ,
    mediaType = "text/plain;charset=US-ASCII",
    params = "",
    data,
  ] = match;

  // Parse parameters (e.g., "name=file.png;base64" or just "base64")
  const paramParts = params.split(";").filter(Boolean);
  let isBase64 = false;
  let name: string | undefined;

  for (const param of paramParts) {
    if (param.toLowerCase() === "base64") {
      isBase64 = true;
    } else if (param.toLowerCase().startsWith("name=")) {
      name = decodeURIComponent(param.slice(5));
    } else if (param.toLowerCase().startsWith("filename=")) {
      name = decodeURIComponent(param.slice(9));
    }
  }

  return {
    mediaType,
    isBase64,
    data,
    name,
  };
}

function getDataUrlStream(dataUrl: string): Readable {
  const parsed = parseDataUrl(dataUrl);
  const buffer = parsed.isBase64
    ? Buffer.from(parsed.data, "base64")
    : Buffer.from(decodeURIComponent(parsed.data), "utf-8");
  return Readable.from(buffer);
}

function getDataUrlStreamAndMetadata(dataUrl: string): { stream: Readable; metadata: FileMetadata } {
  const parsed = parseDataUrl(dataUrl);
  const buffer = parsed.isBase64
    ? Buffer.from(parsed.data, "base64")
    : Buffer.from(decodeURIComponent(parsed.data), "utf-8");

  // Use name from data URL if available, otherwise generate from media type
  let name = parsed.name;
  if (!name) {
    const ext = mime.extension(parsed.mediaType);
    name = ext
      ? `file.${ext}`
      : "file";
  }

  const metadata: FileMetadata = {
    size: buffer.length,
    contentType: parsed.mediaType || undefined,
    name,
  };

  return {
    stream: Readable.from(buffer),
    metadata,
  };
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
  const lastModified = headers.get("last-modified")
    ? new Date(headers.get("last-modified")!)
    : undefined;
  const etag = headers.get("etag") || undefined;
  const urlObj = new URL(url);
  const name = basename(urlObj.pathname);
  const contentType = headers.get("content-type") || mime.lookup(urlObj.pathname) || undefined;

  const baseMetadata = {
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

async function downloadToTemporaryFile(response: Response, baseMetadata: Partial<FileMetadata>): Promise<{ stream: Readable; metadata: FileMetadata }> {
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

    stream.once("close", cleanup);
    stream.once("end", cleanup);
    stream.once("error", cleanup);

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
