import { createHmac, timingSafeEqual } from "node:crypto";

export const DEFAULT_WEBHOOK_TOLERANCE_SECONDS = 300;
export const DEFAULT_DEDUP_LIMIT = 500;
export const SEEN_EVENT_IDS_KEY = "seenEventIds";

export const PAYMOS_CANONICAL_WEBHOOK_EVENTS = Object.freeze([
  "invoice.awaiting_payment",
  "invoice.confirming",
  "invoice.underpaid_waiting",
  "invoice.paid",
  "invoice.paid_over",
  "invoice.underpaid",
  "invoice.expired",
  "invoice.cancelled",
  "invoice.paid_late",
  "payment_channel.deposit.confirming",
  "payment_channel.deposit.reorged",
  "payment_channel.deposit.confirmed",
  "withdrawal.created",
  "withdrawal.processing",
  "withdrawal.completed",
  "withdrawal.failed",
  "withdrawal.cancelled",
  "withdrawal.completion_rewound",
]);

export const INVALID_WEBHOOK_SIGNATURE_PROBLEM = Object.freeze({
  type: "about:blank",
  title: "Unauthorized",
  status: 401,
  detail: "Invalid webhook signature.",
  code: "webhook_signature_invalid",
});

export class SignatureMismatchError extends Error {
  constructor(message) {
    super(message);
    this.name = "SignatureMismatchError";
  }
}

export class TimestampSkewError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimestampSkewError";
  }
}

export function validateWebhookSecret(secret) {
  const trimmed = typeof secret === "string" ? secret.trim() : "";
  if (!trimmed || !trimmed.startsWith("whsec_")) {
    throw new Error(
      "Webhook Signing Secret must start with whsec_. Register this source's HTTP endpoint URL in Paymos Dashboard -> Developer -> Webhooks and paste the generated whsec_ secret.",
    );
  }
  return trimmed;
}

export function readSignatureHeader(headers) {
  if (!headers || typeof headers !== "object") {
    return "";
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== "x-webhook-signature" || value === undefined || value === null) {
      continue;
    }
    return Array.isArray(value) ? String(value[0] ?? "") : String(value);
  }
  return "";
}

function parseHeader(header) {
  if (typeof header !== "string") {
    return null;
  }
  let timestamp;
  let timestampCount = 0;
  const signatures = [];

  for (const part of header.split(",")) {
    const separator = part.indexOf("=");
    if (separator < 1) {
      continue;
    }
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "t" && /^\d+$/.test(value)) {
      timestamp = Number(value);
      timestampCount += 1;
    }
    if (key === "v1" && value !== "") {
      signatures.push(value);
    }
  }

  if (
    timestamp === undefined ||
    timestampCount !== 1 ||
    !Number.isSafeInteger(timestamp) ||
    signatures.length === 0
  ) {
    return null;
  }

  return {
    timestamp,
    signatures,
  };
}

function assertEventEnvelope(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Webhook payload must be a JSON object.");
  }
  if (typeof value.event_id !== "string" || value.event_id.trim() === "") {
    throw new TypeError("Webhook event_id must be a non-empty string.");
  }
  if (typeof value.event_type !== "string" || value.event_type.trim() === "") {
    throw new TypeError("Webhook event_type must be a non-empty string.");
  }
  if (typeof value.version !== "number" || !Number.isSafeInteger(value.version) || value.version < 1) {
    throw new TypeError("Webhook version must be a positive integer.");
  }
  if (
    typeof value.occurred_at !== "number" ||
    !Number.isSafeInteger(value.occurred_at) ||
    value.occurred_at < 0
  ) {
    throw new TypeError("Webhook occurred_at must be a non-negative Unix timestamp.");
  }
  if (value.data === null || typeof value.data !== "object" || Array.isArray(value.data)) {
    throw new TypeError("Webhook data must be an object.");
  }
}

export function assertValidWebhookSignature(
  rawBody,
  signatureHeader,
  secret,
  toleranceSeconds = DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  if (typeof secret !== "string" || secret.trim() === "") {
    throw new TypeError("Webhook secret must be a non-empty string.");
  }
  if (!Number.isSafeInteger(toleranceSeconds) || toleranceSeconds < 0) {
    throw new TypeError("Webhook tolerance must be a non-negative integer.");
  }
  if (typeof rawBody !== "string" && !Buffer.isBuffer(rawBody)) {
    throw new SignatureMismatchError("Webhook rawBody is missing.");
  }

  const parsed = parseHeader(signatureHeader);
  if (!parsed) {
    throw new SignatureMismatchError("Webhook signature header is missing or malformed.");
  }
  if (Math.abs(nowSeconds - parsed.timestamp) > toleranceSeconds) {
    throw new TimestampSkewError("Webhook timestamp is outside the allowed tolerance.");
  }

  const hmac = createHmac("sha256", secret).update(`${parsed.timestamp}.`, "utf8");
  if (Buffer.isBuffer(rawBody)) {
    hmac.update(rawBody);
  } else {
    hmac.update(rawBody, "utf8");
  }
  const expected = hmac.digest();

  let matched = false;
  for (const signature of parsed.signatures) {
    if (!/^[0-9a-fA-F]{64}$/.test(signature)) {
      continue;
    }
    const candidate = Buffer.from(signature, "hex");
    if (candidate.length === expected.length && timingSafeEqual(candidate, expected)) {
      matched = true;
    }
  }

  if (!matched) {
    throw new SignatureMismatchError("Webhook signature does not match payload.");
  }
}

export function verifyWebhookSignature(
  rawBody,
  signatureHeader,
  secret,
  toleranceSeconds = DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  try {
    assertValidWebhookSignature(rawBody, signatureHeader, secret, toleranceSeconds, nowSeconds);
    return true;
  } catch {
    return false;
  }
}

export function parseWebhookEvent(
  rawBody,
  signatureHeader,
  secret,
  toleranceSeconds = DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  assertValidWebhookSignature(rawBody, signatureHeader, secret, toleranceSeconds, nowSeconds);
  let parsed;
  try {
    const text = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody;
    parsed = JSON.parse(text);
  } catch (error) {
    throw new TypeError("Webhook payload is not valid JSON.", { cause: error });
  }
  assertEventEnvelope(parsed);
  return parsed;
}

export function trackSeenEventId(seenEventIds, eventId, maxEntries = DEFAULT_DEDUP_LIMIT) {
  if (typeof eventId !== "string" || eventId.trim() === "") {
    throw new TypeError("Webhook event_id must be a non-empty string.");
  }
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) {
    throw new TypeError("Deduplication limit must be a positive integer.");
  }

  const existing = Array.isArray(seenEventIds)
    ? seenEventIds.filter((item) => typeof item === "string" && item !== "")
    : [];

  if (existing.includes(eventId)) {
    const boundedExisting = existing.length > maxEntries
      ? existing.slice(existing.length - maxEntries)
      : [...existing];
    return {
      isDuplicate: true,
      seenEventIds: boundedExisting,
    };
  }

  const next = [...existing, eventId];
  const boundedNext = next.length > maxEntries
    ? next.slice(next.length - maxEntries)
    : next;

  return {
    isDuplicate: false,
    seenEventIds: boundedNext,
  };
}
