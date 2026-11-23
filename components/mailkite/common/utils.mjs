import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import { FRESHNESS_MS } from "./constants.mjs";

/**
 * Coerce a value that may arrive as a JSON string into the object/array it encodes. Pipedream
 * hands `object` and `string[]` props through as strings when they are set from an expression
 * (e.g. `{{steps.trigger.event.attachments}}`), so every structured prop has to accept both
 * shapes.
 *
 * @param {*} value - The raw prop value.
 * @param {string} label - Prop label, used in the error message.
 * @returns {*} The parsed value, or `value` unchanged when it is not a string.
 * @throws {ConfigurationError} When a string is not valid JSON.
 */
export function maybeParseJson(value, label) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError(`${label} must be valid JSON — could not parse: ${value}`);
  }
}

/**
 * Normalize the Attachments prop into the `[{ filename, url | content, contentType }]` array
 * `POST /v1/send` accepts. Entries may be objects or JSON strings, and the whole prop may be a
 * single JSON string encoding the array.
 *
 * @param {*} value - The raw `attachments` prop value.
 * @returns {object[]|undefined} The attachment array, or `undefined` when nothing was set.
 * @throws {ConfigurationError} When an entry is not an object or has no `filename`.
 */
export function parseAttachments(value) {
  if (value == null) return undefined;
  const parsed = maybeParseJson(value, "Attachments");
  const list = Array.isArray(parsed)
    ? parsed
    : [
      parsed,
    ];
  const out = list
    .filter((entry) => entry != null && entry !== "")
    .map((entry, i) => {
      const a = maybeParseJson(entry, `Attachment ${i + 1}`);
      if (a === null || typeof a !== "object" || Array.isArray(a)) {
        throw new ConfigurationError(
          `Attachment ${i + 1} must be an object with a \`filename\` and either \`url\` or \`content\`.`,
        );
      }
      if (typeof a.filename !== "string" || !a.filename.trim()) {
        throw new ConfigurationError(`Attachment ${i + 1} is missing \`filename\`.`);
      }
      return a;
    });
  return out.length
    ? out
    : undefined;
}

/**
 * Normalize the Extra Headers prop into the `Record<string, string>` the API expects. Values are
 * coerced to strings (a Pipedream expression readily yields a number or a boolean); blank values
 * are dropped so an unresolved expression does not emit an empty header.
 *
 * @param {*} value - The raw `headers` prop value.
 * @returns {object|undefined} The header map, or `undefined` when nothing usable was set.
 * @throws {ConfigurationError} When the prop is not an object, or a value is not a scalar.
 */
export function normalizeHeaders(value) {
  if (value == null) return undefined;
  const parsed = maybeParseJson(value, "Extra Headers");
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError("Extra Headers must be an object of header name → value.");
  }
  const out = {};
  for (const [
    name,
    v,
  ] of Object.entries(parsed)) {
    if (!name.trim() || v == null || v === "") continue;
    if (typeof v === "object") {
      throw new ConfigurationError(
        `Header \`${name}\` must be a string — got ${Array.isArray(v)
          ? "an array"
          : "an object"}.`,
      );
    }
    out[name] = String(v);
  }
  return Object.keys(out).length
    ? out
    : undefined;
}

/**
 * Normalize the Template Data prop. Pipedream may hand it to us as a JSON string (for example
 * from a workflow expression); the API requires an object, so parse strings and reject anything
 * that is not a plain object before the request rather than sending a string the API ignores.
 *
 * @param {*} value - The raw `templateData` prop value.
 * @returns {object|undefined} The merge-tag map, or `undefined` when nothing was set.
 * @throws {ConfigurationError} When the value is not a non-null, non-array object.
 */
export function normalizeTemplateData(value) {
  if (value == null) return undefined;
  const parsed = maybeParseJson(value, "Template Data");
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError(
      "Template Data must be an object of merge-tag name → value, e.g. `{\"firstname\":\"Jane\"}`.",
    );
  }
  return parsed;
}

/**
 * Normalize the Schedule Send prop. The API's parser takes an ISO 8601 string, simple relative
 * language ("in 2 hours"), or a ms-epoch **number** — a ms-epoch sent as a *string* is rejected
 * with `bad_schedule`, because it falls through to `Date.parse()`. Pipedream props are strings,
 * so an all-digits value is converted here rather than 400ing at the API.
 *
 * @param {*} value - The raw `scheduledAt` prop value.
 * @returns {string|number|undefined} The value to send, or `undefined` when nothing was set.
 * @throws {ConfigurationError} When the value is a non-finite time — a number such as `NaN`, or a
 * digit-only string long enough to overflow to `Infinity` — which would otherwise be dropped and
 * send the mail immediately.
 */
export function normalizeScheduledAt(value) {
  if (value == null) return undefined;
  const nonFinite = (v) => new ConfigurationError(
    `Schedule Send must be a finite time — got ${v}. Use an ISO 8601 timestamp, relative language like \`in 2 hours\`, or a ms-epoch.`,
  );
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw nonFinite(value);
    return value;
  }
  const s = String(value).trim();
  if (!s) return undefined;
  if (!/^\d+$/.test(s)) return s;
  // Checked *after* converting: 309 digits parse to `Infinity`, and JSON.stringify turns that
  // into `null`, which the API reads as "no schedule" — the mail would go out immediately.
  const epoch = Number(s);
  if (!Number.isFinite(epoch)) throw nonFinite(s);
  return epoch;
}

/**
 * Human-readable step summary. A future `scheduledAt` returns `status: "scheduled"` and an
 * `ssnd_…` id instead of a sent `msg_…`, so the summary reads the response rather than assuming
 * the message went out.
 *
 * @param {object} response - The `POST /v1/send` response body.
 * @param {string|string[]} to - The configured recipient(s).
 * @returns {string} The `$summary` line.
 */
export function summarize(response, to) {
  const recipients = [].concat(to ?? []).join(", ");
  const id = response?.id;
  if (response?.status === "scheduled") {
    const when = Number.isFinite(response.scheduledAt)
      ? new Date(response.scheduledAt).toISOString()
      : "a scheduled time";
    return `Scheduled email to ${recipients} for ${when} (id: ${id})`;
  }
  if (response?.status === "sent") {
    return `Sent email to ${recipients} (id: ${id})`;
  }
  return `Email to ${recipients} accepted with status "${response?.status}" (id: ${id})`;
}

/**
 * Normalize a template row into the shape callers and agents work with: the id that
 * `Send Email`'s `Template ID` accepts, a human name, and whether it is a MailKite base
 * template or one the account saved.
 *
 * @param {object} t - A row from `GET /api/templates` or `GET /api/templates/base`.
 * @returns {object} The normalized template.
 */
export function toTemplate(t) {
  return {
    id: t.id,
    name: t.name,
    category: t.category || null,
    subject: t.subject || null,
    isBase: Boolean(t.is_base),
    updatedAt: t.updated_at ?? null,
  };
}

/**
 * Verify an `x-mailkite-signature: t=<ms>,v1=<hex>` header over the exact bytes MailKite
 * signed. Mirrors the canonical verifier — `MailKite.verifyWebhook` in the MailKite Node
 * SDK — so there is one algorithm to reason about: `v1` is
 * `HMAC-SHA256(secret, "<t>.<rawBody>")` as lowercase hex, and `t` is milliseconds since
 * the epoch.
 *
 * @param {string} secret - The webhook signing secret (`whsec_…`).
 * @param {string} signatureHeader - Raw `x-mailkite-signature` header value.
 * @param {string} rawBody - The unparsed request body, byte-for-byte as delivered.
 * @param {number} [toleranceMs] - Replay window in ms; `0` disables the freshness check.
 * @returns {boolean} `true` only if the header is well-formed, fresh, and authentic.
 */
export function verifySignature(secret, signatureHeader, rawBody, toleranceMs = FRESHNESS_MS) {
  if (typeof signatureHeader !== "string" || !signatureHeader) {
    return false;
  }
  const parts = {};
  for (const seg of signatureHeader.split(",")) {
    const i = seg.indexOf("=");
    if (i !== -1) {
      parts[seg.slice(0, i).trim()] = seg.slice(i + 1).trim();
    }
  }
  const t = Number(parts.t);
  if (!parts.t || !parts.v1 || !Number.isFinite(t)) {
    return false;
  }
  // Freshness: a delivery captured off the wire stops verifying once it is stale, and a
  // timestamp far in the future is equally suspect.
  if (toleranceMs > 0 && Math.abs(Date.now() - t) > toleranceMs) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  // Compare decoded bytes, as the SDK does — invalid hex decodes short and fails on length.
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(parts.v1, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
