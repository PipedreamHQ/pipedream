import { ConfigurationError } from "@pipedream/platform";

export const ENVELOPE_CREATION_STATUS_OPTIONS = [
  "sent",
  "created",
];

export const ENVELOPE_STATUS_OPTIONS = [
  "any",
  "completed",
  "created",
  "declined",
  "deleted",
  "delivered",
  "processing",
  "sent",
  "signed",
  "timedout",
  "voided",
];

export function parseJsonObject(value, label) {
  let parsed;
  try {
    parsed = typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (err) {
    throw new ConfigurationError(`${label} must be valid JSON.`);
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new ConfigurationError(`${label} must be a JSON object.`);
  }

  return parsed;
}

export function parseOptionalJsonObject(value, label) {
  if (!value) {
    return undefined;
  }
  return parseJsonObject(value, label);
}

export async function streamToBase64(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk));
  }
  return Buffer.concat(chunks)
    .toString("base64");
}

export function getDefaultFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

export function getFileExtension(filename = "") {
  const extension = filename.split(".")
    .pop();
  return extension && extension !== filename
    ? extension
    : "pdf";
}
