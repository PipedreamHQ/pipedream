import fs from "node:fs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

/**
 * Resolve a file-ref prop (a URL or a `/tmp` path) to
 * `{ stream, filename, contentType, size }`. Returns undefined for a falsy ref.
 */
export async function resolveFileRef(ref, fallbackName = "file") {
  if (!ref) {
    return undefined;
  }
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(ref);
  return {
    stream,
    filename: metadata?.name || fallbackName,
    contentType: metadata?.contentType,
    size: metadata?.size,
  };
}

/**
 * Build the `context` multipart file parts. Emboss takes `context` as a FILE
 * list (a bare text field is rejected): typed text becomes a context.txt
 * part; a context file keeps its real filename + mime. Both may be present.
 */
export function contextParts(contextText, contextFile) {
  const parts = [];
  if (contextText) {
    parts.push({
      value: Buffer.from(String(contextText), "utf8"),
      filename: "context.txt",
      contentType: "text/plain",
    });
  }
  if (contextFile && contextFile.stream) {
    parts.push({
      value: contextFile.stream,
      filename: contextFile.filename || "context",
      contentType: contextFile.contentType || "application/octet-stream",
      knownLength: contextFile.size,
    });
  }
  return parts;
}

/**
 * Write PDF bytes to `/tmp` and return `{ filepath }` (the registry
 * convention for file outputs; the syncDir prop exposes it via File Stash).
 */
export async function writePdf(buffer, name) {
  const filepath = `/tmp/${name}`;
  await fs.promises.writeFile(filepath, buffer);
  return {
    filepath,
  };
}

/** Normalize an async job's error payload to a human string. */
export function errorDetail(e) {
  return typeof e === "string"
    ? e
    : (e && (e.message || e.code)) || "no detail";
}
