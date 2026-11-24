import { createHash } from "crypto";

const PROFILE_PATTERN = /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?(?:www\.)?linkedin\.com\/in\/([^/?#\s]+)/i;
const MAX_EVENT_ID_LENGTH = 64;

/**
 * Returns the canonical LinkedIn profile URL for a person, or throws a plain-language error
 * for anything else (company pages, post links, blank values).
 */
function normalizeProfileUrl(raw) {
  const value = String(raw ?? "").trim();
  const match = value.match(PROFILE_PATTERN);
  if (!match) {
    throw new Error(`"${value || "(blank)"}" is not a LinkedIn profile URL for a person. Use a URL like https://www.linkedin.com/in/jane-doe (company pages and post links do not work).`);
  }
  return `https://www.linkedin.com/in/${match[1]}`;
}

/** Trims a value; empty or missing values become null (FirstTouch expects explicit nulls). */
function cleanText(value) {
  const text = String(value ?? "").trim();
  return text === ""
    ? null
    : text;
}

/** Event IDs longer than 64 characters are replaced by a stable SHA-256 prefix. */
function toEventId(id) {
  const value = String(id);
  return value.length <= MAX_EVENT_ID_LENGTH
    ? value
    : createHash("sha256").update(value)
      .digest("hex")
      .slice(0, MAX_EVENT_ID_LENGTH);
}

/**
 * Keeps custom variable values as FirstTouch types them (string, number, boolean).
 * Rejects nested objects and arrays instead of silently stringifying them.
 */
function cleanCustomVariables(input) {
  const output = {};
  for (const [
    rawKey,
    value,
  ] of Object.entries(input || {})) {
    const key = rawKey.trim();
    if (!key || value === undefined || value === null) continue;
    if (![
      "string",
      "number",
      "boolean",
    ].includes(typeof value)) {
      throw new Error(`Custom variable "${key}" must be a string, number or boolean.`);
    }
    output[key] = value;
  }
  return output;
}

export default {
  normalizeProfileUrl,
  cleanText,
  toEventId,
  cleanCustomVariables,
};
