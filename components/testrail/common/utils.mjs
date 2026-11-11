import { ConfigurationError } from "@pipedream/platform";

/**
 * Parses a prop that is documented as a JSON string (object or array).
 * Accepts an already-parsed value too, since MCP clients sometimes send one.
 */
export function parseJson(value, label, expected = "object") {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      throw new ConfigurationError(`${label} must be valid JSON: ${err.message}`);
    }
  }
  const isArray = Array.isArray(parsed);
  if (expected === "array" && !isArray) {
    throw new ConfigurationError(`${label} must be a JSON array`);
  }
  if (expected === "object" && (isArray || typeof parsed !== "object" || parsed === null)) {
    throw new ConfigurationError(`${label} must be a JSON object`);
  }
  return parsed;
}

/**
 * Keeps the named fields of each object. `id` is always kept so results stay chainable.
 */
export function pluck(obj, names) {
  const keep = new Set([
    "id",
    ...names,
  ]);
  return Object.fromEntries(Object.entries(obj).filter(([
    key,
  ]) => keep.has(key)));
}

/**
 * Normalizes TestRail list responses. Newer endpoints return
 * `{ offset, limit, size, _links: { next }, <key>: [...] }`, older ones a bare array.
 * Returns a uniform page so callers never silently truncate: `next_offset` is the
 * offset to request next, or null on the last page.
 */
export function toPage(response, key, {
  offset = 0, limit,
} = {}) {
  const items = Array.isArray(response)
    ? response
    : response?.[key] ?? [];
  const pageOffset = response?.offset ?? offset;
  const next = response?._links?.next;
  let nextOffset = null;
  if (next) {
    const match = /[?&]offset=(\d+)/.exec(next);
    nextOffset = match
      ? Number(match[1])
      : pageOffset + items.length;
  } else if (Array.isArray(response) && limit && items.length >= limit) {
    nextOffset = pageOffset + items.length;
  }
  return {
    [key]: items,
    count: items.length,
    offset: pageOffset,
    next_offset: nextOffset,
  };
}
