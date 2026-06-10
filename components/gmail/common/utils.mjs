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

export default {
  parseArray,
  decodeBase64Url,
  decodeHtmlEntities,
  extractTextFromParts,
  attachTextToParts,
  validateTextPayload,
};
