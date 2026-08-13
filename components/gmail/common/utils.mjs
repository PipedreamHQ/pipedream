import { convert } from "html-to-text";

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

function attachTextToParts(parts) {
  for (const part of parts) {
    if (Array.isArray(part.parts)) {
      attachTextToParts(part.parts);
    }
    if (part.mimeType === "text/html" && part.body?.data) {
      const html = decodeBase64Url(part.body.data);
      part.body.text = convert(html);
    }
    else if (part.mimeType === "text/plain" && part.body?.data) {
      part.body.text = decodeBase64Url(part.body.data);
    }
  }
};

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

/**
 * Decoded plain-text body of a message, HTML converted to text, attachments skipped.
 * A fraction of the size of the raw `payload` tree, which carries base64 `data` for
 * every part plus the MIME scaffolding around it (measured 934 vs 1962 chars on a
 * one-page email).
 */
function getBodyText(payload) {
  if (!payload) return "";
  if (Array.isArray(payload.parts)) return extractTextFromParts(payload.parts).trim();
  if (payload.body?.data) return decodeBase64Url(payload.body.data).trim();
  return "";
}

/**
 * Strip the weight out of a message's `payload` while keeping the parts skeleton.
 *
 * Removes the base64 `body.data` and the decoded `body.text` attached alongside it —
 * together effectively the whole size of a message — and keeps `partId`, `mimeType`,
 * `filename`, `body.size` and `body.attachmentId`. What survives is exactly what the
 * attachment flow needs: `payload.parts[].body.attachmentId` feeds Download Attachment.
 *
 * Mutates the message it is given, so hand it a record you own.
 */
function stripPayloadData(message) {
  const stripPart = (part) => {
    if (!part) return;
    if (part.body) {
      delete part.body.data;
      delete part.body.text;
    }
    if (Array.isArray(part.parts)) {
      part.parts.forEach(stripPart);
    }
  };
  stripPart(message?.payload);
  return message;
}

/**
 * Shrink an array of messages until it serializes under `maxChars`.
 *
 * Which axis to shrink depends on WHO CHOSE THE SHAPE:
 *
 * - The caller named `fields`: never reshape the record while more than one message
 *   remains. Removing a field it explicitly asked for produces a confident wrong answer —
 *   a digest written from snippets reads exactly like one written from bodies, so nothing
 *   downstream can tell. Drop whole MESSAGES instead and report the shortfall: "showing
 *   12 of 50" is visible and recoverable, because the caller can narrow the query.
 * - The caller named nothing: project every message onto `compactFields`. That keeps the
 *   result COMPLETE, so "how many match?" stays correct, and the caller lost only detail
 *   it never asked for.
 *
 * Dropping stops at ONE message, never zero. An empty list next to `matchCount: 1` reads
 * as "no such email" to the caller, which is the one outcome it cannot recover from — and
 * "narrow the query and retry" is not advice a single match can act on. When one oversized
 * record is all that is left, the record itself is shrunk instead, in order of how much
 * weight each step sheds against how much the caller loses: first the payload's base64
 * blobs, then — only as a last resort, and in knowing tension with the rule above —
 * `compactFields`. That reshape is the lesser evil only because the alternative here is an
 * empty array, which is confidently wrong AND hides that it is.
 *
 * The ceiling exists because an MCP client that receives an oversized result may spill it
 * to a file and hand the model a path instead of the data, in which case the model sees
 * nothing at all. A trimmed result it can read beats a complete one it cannot. That is
 * also why the floor of one cannot stand alone: returning a single 200 KB record would
 * trade an empty array for a blob the caller may be unable to read.
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
      payloadStripped: false,
      oversized: false,
    };
  }

  let compacted = !callerChoseFields;
  let kept = compacted
    ? messages.map((m) => pluckFields(m, compactFields))
    : messages;
  while (kept.length > 1 && size(kept) > maxChars) {
    kept = kept.slice(0, -1);
  }

  // One message left and still over budget: shrink the RECORD, not the list. Cloned
  // first so the caller's array is left intact — it still owns the untrimmed records,
  // and `matchCount` is read off it.
  let payloadStripped = false;
  if (kept.length === 1 && size(kept) > maxChars && kept[0]?.payload) {
    kept = [
      stripPayloadData(JSON.parse(JSON.stringify(kept[0]))),
    ];
    payloadStripped = true;
  }
  if (kept.length === 1 && size(kept) > maxChars && !compacted) {
    kept = kept.map((m) => pluckFields(m, compactFields));
    compacted = true;
  }

  return {
    messages: kept,
    compacted,
    dropped: messages.length - kept.length,
    payloadStripped,
    oversized: size(kept) > maxChars,
  };
}

export default {
  parseArray,
  decodeBase64Url,
  decodeHtmlEntities,
  extractTextFromParts,
  attachTextToParts,
  validateTextPayload,
  getHeader,
  pluckFields,
  getBodyText,
  stripPayloadData,
  fitToBudget,
};
