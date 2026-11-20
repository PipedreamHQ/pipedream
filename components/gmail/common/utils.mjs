import { convert } from "html-to-text";

// Whole lines only: U+200C is meaningful inside words in some scripts.
const PADDING_LINE = /^(?:[\s\u00AD\u200B-\u200D\u2060\uFEFF]|\u034F)+$/gm;

const NO_LINK_OPTIONS = {
  formatters: {
    altOnly: (elem, walk, builder) => {
      if (elem.attribs?.alt) {
        builder.addInline(elem.attribs.alt);
      }
    },
  },
  selectors: [
    {
      selector: "a",
      options: {
        ignoreHref: true,
      },
    },
    {
      selector: "img",
      format: "altOnly",
    },
  ],
};

function parseArray(arr) {
  if (!arr) {
    return undefined;
  }
  return typeof arr === "string"
    ? JSON.parse(arr)
    : arr;
}

function decodeBase64Url(data) {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
};

function extractTextFromParts(parts) {
  let text = "";
  for (const part of parts) {
    if (Array.isArray(part.parts)) {
      text += extractTextFromParts(part.parts);
    }
    if (part.mimeType === "text/plain" && part.body?.data) {
      text += decodeBase64Url(part.body.data);
    }
    else if (part.mimeType === "text/html" && part.body?.data) {
      const html = decodeBase64Url(part.body.data);
      text += convert(html);
    }
  }
  return text;
};

function htmlToText(html, { includeLinks = true } = {}) {
  return convert(html, includeLinks
    ? {}
    : NO_LINK_OPTIONS);
}

function attachTextToParts(parts, opts) {
  for (const part of parts) {
    if (Array.isArray(part.parts)) {
      attachTextToParts(part.parts, opts);
    }
    if (part.mimeType === "text/html" && part.body?.data) {
      const html = decodeBase64Url(part.body.data);
      part.body.text = htmlToText(html, opts);
    }
    else if (part.mimeType === "text/plain" && part.body?.data) {
      part.body.text = decodeBase64Url(part.body.data);
    }
  }
};

function attachTextToPayload(payload, opts) {
  if (Array.isArray(payload?.parts)) {
    attachTextToParts(payload.parts, opts);
  } else if (payload?.body?.data) {
    const decoded = decodeBase64Url(payload.body.data);
    payload.body.text = payload.mimeType === "text/html"
      ? htmlToText(decoded, opts)
      : decoded;
  }
}

// Uses one rendering of a multipart/alternative: HTML, else text/plain.
function partToText(part, opts) {
  if (Array.isArray(part.parts)) {
    if (part.mimeType === "multipart/alternative") {
      const ordered = [
        ...part.parts.filter((p) => p.mimeType !== "text/plain"),
        ...part.parts.filter((p) => p.mimeType === "text/plain"),
      ];
      for (const alternative of ordered) {
        const text = partToText(alternative, opts);
        if (text) {
          return text;
        }
      }
      return "";
    }
    return part.parts.map((p) => partToText(p, opts)).filter(Boolean)
      .join("\n\n");
  }
  if (part.filename || !part.body?.data) {
    return "";
  }
  if (part.mimeType === "text/html") {
    return htmlToText(decodeBase64Url(part.body.data), opts).trim();
  }
  if (part.mimeType === "text/plain") {
    return decodeBase64Url(part.body.data).trim();
  }
  return "";
}

function getHeader(headers, name) {
  const target = name.toLowerCase();
  return headers?.find((h) => h.name.toLowerCase() === target)?.value;
}

function validateTextPayload(message, withTextPayload) {
  if (withTextPayload) {
    let newPayload = "";
    if (message.payload?.body?.data && !Array.isArray(message.payload.parts)) {
      const decodedBody = decodeBase64Url(message.payload.body.data);
      newPayload = convert(decodedBody);
    } else if (Array.isArray(message.payload?.parts)) {
      newPayload = extractTextFromParts(message.payload.parts);
    }
    message.payload = newPayload;
    return message;
  }
  return false;
}

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
};

function decodeHtmlEntities(str) {
  if (!str) return str;
  return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#x")) {
      return String.fromCodePoint(parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith("#")) {
      return String.fromCodePoint(parseInt(entity.slice(1), 10));
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/**
 * Keep only `fields` on each message, plus the keys in `always` (ids the caller needs
 * to chain into other tools). Returns the object untouched when no fields are named,
 * so an omitted `fields` prop reproduces the tool's previous output exactly.
 */
function pluckFields(message, fields, always = [
  "id",
  "threadId",
]) {
  if (!fields?.length) return message;
  const keep = new Set([
    ...always,
    ...fields,
  ]);
  return Object.fromEntries(
    Object.entries(message).filter(([
      key,
    ]) => keep.has(key)),
  );
}

/**
 * Ceiling for a single tool response, shared by every action that returns messages.
 *
 * Sized to stay under a typical MCP client's per-result token limit (Claude Code
 * truncates at 25k tokens; message JSON runs ~1.7 chars/token, so the previous 100k was
 * ~2.4x over). Going over is not merely verbose — the client may spill the result to a
 * file and hand the model a path, so the model sees NOTHING. Measured: a 56-message
 * search returned 42k chars and was spilled.
 *
 * It lives here because the limit is a property of the CLIENT, not of any one action:
 * every action returning messages has to respect the same number, and two copies would
 * drift.
 */
export const MAX_RESPONSE_CHARS = 30_000;

export const MIN_BODY_CHARS = 400;

/**
 * Decoded plain-text body of a message, HTML converted to text, attachments skipped.
 * A fraction of the size of the raw `payload` tree, which carries base64 `data` for
 * every part plus the MIME scaffolding around it (measured 934 vs 1962 chars on a
 * one-page email).
 */
function getBodyText(payload, opts) {
  if (!payload) return "";
  if (Array.isArray(payload.parts) || payload.body?.data) {
    return partToText(payload, opts).replace(PADDING_LINE, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return "";
}

// Identifies common attachment types from their leading bytes, for parts whose
// MIME type is missing or `application/octet-stream`.
function sniffMimeType(buffer) {
  const hex = buffer.subarray(0, 12).toString("hex");
  if (hex.startsWith("25504446")) return "application/pdf";
  if (hex.startsWith("89504e47")) return "image/png";
  if (hex.startsWith("ffd8ff")) return "image/jpeg";
  if (hex.startsWith("47494638")) return "image/gif";
  if (hex.startsWith("52494646") && hex.slice(16, 24) === "57454250") return "image/webp";
  if (hex.startsWith("504b0304")) return "application/zip";
  return undefined;
}

/**
 * Every named attachment in a full-format payload, nested parts included, as
 * `{ partId, filename, mimeType, size }`. Kept small on purpose so it survives the
 * response cap that drops `payload`: `attachmentId` is left out because it runs to
 * hundreds of chars and Gmail issues a new one on every read, while `partId` is
 * short and stable, and **Download Attachment** resolves it to a fresh id itself.
 * Parts without a filename are skipped: Gmail also stores large HTML/text bodies
 * behind an `attachmentId`, and those are not attachments. A small named part can
 * carry its content inline in `body.data` instead of behind an `attachmentId`.
 */
function getAttachments(payload) {
  const attachments = [];
  const walk = (part) => {
    if (!part) return;
    if (part.filename && (part.body?.attachmentId || part.body?.data)) {
      attachments.push({
        partId: part.partId,
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size,
      });
    }
    for (const child of part.parts ?? []) {
      walk(child);
    }
  };
  walk(payload);
  return attachments;
}

function capBodies(records, bodyOf, {
  cap, floor, maxChars, measure,
}) {
  const applyCap = (limit) => {
    for (const record of records) {
      const body = bodyOf(record) ?? "";
      record.bodyText = body.slice(0, limit);
      if (body.length > limit) {
        record.bodyTruncated = true;
        record.bodyTotalChars = body.length;
      } else {
        delete record.bodyTruncated;
        delete record.bodyTotalChars;
      }
    }
  };
  applyCap(cap);
  while (measure() > maxChars && cap > floor) {
    cap = Math.max(floor, Math.floor(cap / 2));
    applyCap(cap);
  }
  return cap;
}

/**
 * Shrink an array of messages until it serializes under `maxChars`.
 *
 * Which axis to shrink depends on WHO CHOSE THE SHAPE:
 *
 * - The caller named `fields`: never reshape the record. Removing a field it explicitly
 *   asked for produces a confident wrong answer — a digest written from snippets reads
 *   exactly like one written from bodies, so nothing downstream can tell. Drop whole
 *   MESSAGES instead and report the shortfall: "showing 12 of 50" is visible and
 *   recoverable, because the caller can narrow the query and retry.
 * - The caller named nothing: project every message onto `compactFields`. That keeps the
 *   result COMPLETE, so "how many match?" stays correct, and the caller lost only detail
 *   it never asked for.
 *
 * The ceiling exists because an MCP client that receives an oversized result may spill it
 * to a file and hand the model a path instead of the data, in which case the model sees
 * nothing at all. A trimmed result it can read beats a complete one it cannot.
 */
function fitToBudget(messages, maxChars, {
  compactFields, callerChoseFields = false,
}) {
  const size = (m) => JSON.stringify(m).length;
  if (size(messages) <= maxChars) {
    return {
      messages,
      compacted: false,
      dropped: 0,
    };
  }

  const compacted = !callerChoseFields;
  let kept = compacted
    ? messages.map((m) => pluckFields(m, compactFields))
    : messages;
  while (kept.length > 0 && size(kept) > maxChars) {
    kept = kept.slice(0, -1);
  }
  return {
    messages: kept,
    compacted,
    dropped: messages.length - kept.length,
  };
}

export default {
  parseArray,
  decodeBase64Url,
  decodeHtmlEntities,
  extractTextFromParts,
  attachTextToParts,
  attachTextToPayload,
  validateTextPayload,
  getHeader,
  pluckFields,
  getBodyText,
  getAttachments,
  sniffMimeType,
  capBodies,
  fitToBudget,
};
