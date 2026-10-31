import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

/**
 * Accepts a JSON string, an array of JSON strings, or an already-parsed value
 * and returns the parsed value. Throws a ConfigurationError on invalid JSON.
 */
function parseObject(value, label = "value") {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new ConfigurationError(`Invalid JSON in ${label}: ${e.message}`);
    }
  }
  if (Array.isArray(value)) {
    return value.map((item) => parseObject(item, label));
  }
  return value;
}

/**
 * Serializes query params so array values are repeated (`platform=a&platform=b`),
 * which is what the TokPortal API expects for repeatable filters.
 */
function serializeParams(params = {}) {
  const searchParams = new URLSearchParams();
  for (const [
    key,
    value,
  ] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null && item !== "") {
          searchParams.append(key, String(item));
        }
      }
      continue;
    }
    searchParams.append(key, String(value));
  }
  return searchParams.toString();
}

/** Parses `t=<unix_ts>,v1=<hex>` into its parts. */
function parseSignatureHeader(header) {
  const result = {
    timestamp: null,
    signature: null,
  };
  if (!header || typeof header !== "string") {
    return result;
  }
  for (const part of header.split(",")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (key === "t") {
      result.timestamp = value;
    }
    if (key === "v1") {
      result.signature = value;
    }
  }
  return result;
}

/**
 * Verifies a TokPortal webhook signature.
 * Scheme: `TokPortal-Signature: t=<unix_ts>,v1=<hex(HMAC-SHA256(secret, "<t>.<raw_body>"))>`
 */
function verifySignature({
  rawBody,
  signatureHeader,
  secret,
  toleranceSeconds = constants.DEFAULT_SIGNATURE_TOLERANCE_SECONDS,
  nowSeconds = Date.now() / 1000,
}) {
  const {
    timestamp, signature,
  } = parseSignatureHeader(signatureHeader);
  if (!timestamp || !signature || !secret) {
    return false;
  }
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    return false;
  }
  if (toleranceSeconds > 0 && Math.abs(nowSeconds - timestampSeconds) > toleranceSeconds) {
    return false;
  }
  const body = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(rawBody ?? "", "utf8");
  const signedPayload = Buffer.concat([
    Buffer.from(`${timestamp}.`, "utf8"),
    body,
  ]);
  const digest = crypto.createHmac("sha256", secret)
    .update(signedPayload)
    .digest();
  let expected;
  try {
    expected = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return expected.length === digest.length && crypto.timingSafeEqual(expected, digest);
}

export default {
  parseObject,
  serializeParams,
  parseSignatureHeader,
  verifySignature,
};
