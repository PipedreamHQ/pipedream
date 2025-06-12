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

export default {
  parseArray,
  decodeBase64Url,
  extractTextFromParts,
  attachTextToParts,
};
