import fs from "fs/promises";
import path from "path";
import { defaultFilename } from "./build-request-body.mjs";

/** Case-insensitive lookup of a single response header value. */
function headerValue(headers, name) {
  if (!headers) {
    return undefined;
  }
  const lower = name.toLowerCase();
  for (const [
    key,
    value,
  ] of Object.entries(headers)) {
    if (key.toLowerCase() === lower) {
      return value;
    }
  }
  return undefined;
}

/**
 * Best-effort extraction of PolyDoc's `{ error, message }` from a thrown HTTP
 * error, including the binary path where the error body arrives as bytes.
 * Ported from the n8n connector's extractApiErrorMessage.
 */
export function extractApiErrorMessage(error) {
  let payload = error?.response?.data ?? error?.response?.body;
  if (payload instanceof ArrayBuffer) {
    payload = Buffer.from(payload).toString("utf8");
  }
  if (Buffer.isBuffer(payload)) {
    payload = payload.toString("utf8");
  }
  if (typeof payload === "string") {
    const text = payload;
    try {
      payload = JSON.parse(text);
    } catch {
      return text || undefined;
    }
  }
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload.message ?? payload.error ?? undefined;
  }
  return undefined;
}

/**
 * Turn a PolyDoc API response into an action return value.
 * - Binary download: write the bytes to the synced file dir (STASH_DIR, /tmp
 *   fallback) and return the path plus metadata so Pipedream syncs the file.
 * - Cloud storage / webhook / base64 screenshot: pass the JSON response through.
 */
export async function handleResponse({
  response, isBinary, operation, imageType, filename,
}) {
  const headers = response?.headers ?? {};
  const conversionId = headerValue(headers, "x-conversion-id");
  const creditUsed = headerValue(headers, "x-credit-used");
  const contentType = headerValue(headers, "content-type");

  if (!isBinary) {
    return {
      success: true,
      conversionId,
      creditUsed,
      data: response?.data,
    };
  }

  const name = path.basename(filename || defaultFilename(operation, imageType));
  const buffer = Buffer.from(response.data);
  const filePath = path.join(process.env.STASH_DIR || "/tmp", name);
  await fs.writeFile(filePath, buffer);

  return {
    success: true,
    contentType,
    sizeBytes: buffer.length,
    conversionId,
    creditUsed,
    filename: name,
    path: filePath,
  };
}
