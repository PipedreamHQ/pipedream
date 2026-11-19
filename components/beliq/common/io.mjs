import fs from "fs/promises";
import path from "path";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";

// Document IO between Pipedream props and the SDK. The SDK owns the wire format;
// these only move bytes in and out of the Pipedream runtime. Pipedream steps
// return JSON, so a produced document is written to the synced /tmp dir and the
// step returns a path plus metadata.

/**
 * Read the raw document bytes for a raw-input op (validate / parse / convert):
 * either pasted text or a file-ref (a /tmp path or a URL) read through the
 * platform's getFileStream. A `contentType` of "auto" defers detection to the
 * SDK (PDF magic vs XML); an explicit choice overrides it.
 */
export async function resolveDocument(props) {
  const source = props.inputSource ?? "text";
  let bytes;

  if (source === "file") {
    const ref = (props.filePath ?? "").trim();
    if (!ref) {
      throw new ConfigurationError("Provide a file path or URL, or switch Input to Text.");
    }
    const chunks = [];
    for await (const chunk of await getFileStream(ref)) {
      chunks.push(chunk);
    }
    bytes = Buffer.concat(chunks);
  } else {
    const text = (props.documentText ?? "").trim();
    if (!text) {
      throw new ConfigurationError("Paste the invoice XML, or switch Input to File.");
    }
    bytes = Buffer.from(text, "utf8");
  }

  if (bytes.length === 0) {
    throw new ConfigurationError("The input document is empty.");
  }

  const selected = props.contentType ?? "auto";
  return {
    bytes,
    contentType: selected === "auto"
      ? undefined
      : selected,
  };
}

/**
 * Write a document-producing op's bytes to the synced /tmp dir and return the
 * path plus the response metadata. The extension follows the response content
 * type. STASH_DIR is Pipedream's per-step synced directory; /tmp is the fallback.
 */
export async function writeDocument(result, kind, filenameOverride) {
  const contentType = result.contentType.split(";")[0].trim();
  const ext = contentType.includes("pdf")
    ? "pdf"
    : "xml";
  const filename = path.basename(filenameOverride || `${kind}.${ext}`);
  const buffer = Buffer.from(result.bytes);
  const filePath = path.join(process.env.STASH_DIR || "/tmp", filename);
  await fs.writeFile(filePath, buffer);

  const meta = Object.fromEntries(
    Object.entries(result.meta ?? {}).filter(([
      ,
      value,
    ]) => value !== undefined),
  );

  return {
    success: true,
    filename,
    path: filePath,
    contentType,
    sizeBytes: buffer.length,
    ...meta,
  };
}
