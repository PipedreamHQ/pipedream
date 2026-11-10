import { ConfigurationError } from "@pipedream/platform";
import {
  createHmac, timingSafeEqual,
} from "node:crypto";
import { WEBHOOK_SIGNATURE_TOLERANCE_SECONDS } from "./constants.mjs";

const isBlank = (value) =>
  value === undefined || value === null || value === "";

/**
 * Parse a prop that may be an object or a JSON string into an object.
 * Returns undefined when the value is blank.
 */
export function parseObject(value, label) {
  if (isBlank(value)) {
    return undefined;
  }
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`The "${label}" field must be a valid JSON object.`);
    }
  }
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError(`The "${label}" field must be a valid JSON object.`);
  }
  return parsed;
}

/**
 * Parse a prop that may be an array of objects / JSON strings, or a single JSON
 * string encoding an array, into an array of objects.
 */
export function parseObjectArray(value, label) {
  if (isBlank(value)) {
    return [];
  }
  let items = value;
  if (typeof value === "string") {
    try {
      items = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`The "${label}" field must be a JSON object or an array of JSON objects.`);
    }
  }
  if (!Array.isArray(items)) {
    items = [
      items,
    ];
  }
  return items.map((item) => parseObject(item, label));
}

/**
 * Coerce a numeric prop (number or numeric string) to a number, optionally
 * enforcing an inclusive [min, max] range. Returns undefined when blank.
 */
export function toNumber(value, label, min, max) {
  if (isBlank(value)) {
    return undefined;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new ConfigurationError(`**${label}** must be a number.`);
  }
  if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
    throw new ConfigurationError(`**${label}** must be between ${min} and ${max}.`);
  }
  return num;
}

/**
 * Return a shallow copy of `obj` without blank (undefined / null / "") values.
 */
export function omitBlank(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([
      , value,
    ]) => !isBlank(value)),
  );
}

/**
 * Build the common fields shared by every document-processing request.
 */
export function buildCommonFields({
  preSignedUrlExpiresIn, metadata,
}) {
  return omitBlank({
    preSignedUrlExpiresIn,
    metadata: parseObject(metadata, "Metadata"),
  });
}

/**
 * Verify a PDFGate webhook signature header of the form `t=<unix>,v1=<hex>`.
 * The signed payload is `${t}.${rawBody}` using HMAC-SHA256 with the webhook secret.
 * Returns true when at least one `v1` signature matches and the timestamp is fresh.
 */
export function verifyWebhookSignature({
  secret, signatureHeader, payload, now = Math.floor(Date.now() / 1000),
}) {
  if (!secret || !signatureHeader || payload === undefined || payload === null) {
    return false;
  }
  let timestamp = null;
  const signatures = [];
  for (const part of String(signatureHeader).split(",")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    if (key === "t" && value) timestamp = Number(value);
    if (key === "v1" && value) signatures.push(value);
  }
  if (!timestamp || Number.isNaN(timestamp) || signatures.length === 0) {
    return false;
  }
  if (Math.abs(now - timestamp) > WEBHOOK_SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  return signatures.some((sig) => {
    try {
      const sigBuf = Buffer.from(sig, "hex");
      return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
    } catch {
      return false;
    }
  });
}
