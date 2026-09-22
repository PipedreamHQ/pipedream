import fs from "node:fs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

const POLL_DELAY_MS = 5000;
const POLL_TIMEOUT_MS = 12 * 60 * 1000;

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
 * Write PDF bytes to the File Stash directory and return `{ filepath }`
 * (the registry convention for file outputs; the syncDir prop exposes it).
 * The name is sanitized (path separators replaced) so the file always lands
 * directly in the stash directory.
 */
export async function writePdf(buffer, name) {
  const safeName = String(name).replace(/[/\\]/g, "_");
  const filepath = `${process.env.STASH_DIR || "/tmp"}/${safeName}`;
  await fs.promises.writeFile(filepath, buffer);
  return {
    filepath,
  };
}

/** Normalize an async job's error payload to a human string. */
function errorDetail(e) {
  return typeof e === "string"
    ? e
    : (e && (e.message || e.code)) || "no detail";
}

/** Resolve after `ms` milliseconds — used to space out in-process polling. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Poll an Emboss async job (form detection or a context fill) until it reports
 * `ready`, re-checking every 5 seconds for up to ~12 minutes. Shared by every
 * action so the cadence, timeout and failure handling stay in one place.
 * @param {object} opts - Polling options.
 * @param {object} opts.initial - The create response, which already carries a `status`.
 * @param {function} opts.getStatus - `async () => status`, re-fetches the job.
 * @param {string} opts.failedPrefix - Prefix for the error thrown on a `failed` job.
 * @param {string} opts.timeoutMessage - Error thrown once the polling budget is spent.
 * @returns {Promise<object>} The final `ready` status payload.
 */
export async function pollUntilReady({
  initial, getStatus, failedPrefix, timeoutMessage,
}) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let status = initial;
  while (status.status !== "ready") {
    if (status.status === "failed") {
      throw new Error(`${failedPrefix}: ${errorDetail(status.error)}`);
    }
    if (Date.now() >= deadline) {
      throw new Error(timeoutMessage);
    }
    await sleep(POLL_DELAY_MS);
    status = await getStatus();
  }
  return status;
}
