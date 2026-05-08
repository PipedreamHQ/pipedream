import { ConfigurationError } from "@pipedream/platform";

/**
 * Parse a required JSON array prop.
 *
 * @param {string|Array} value - JSON string or already parsed array.
 * @param {string} label - Human-readable prop label for error messages.
 * @returns {Array} Parsed array.
 */
export function parseRequiredJsonArray(value, label) {
  let parsed;
  try {
    parsed = typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (err) {
    throw new ConfigurationError(`${label} must be valid JSON.`);
  }

  if (!Array.isArray(parsed)) {
    throw new ConfigurationError(`${label} must be a JSON array.`);
  }

  return parsed;
}

/**
 * Parse an optional JSON object prop.
 *
 * @param {string|object} value - JSON string or already parsed object.
 * @param {string} label - Human-readable prop label for error messages.
 * @returns {object|undefined} Parsed object when provided.
 */
export function parseOptionalJsonObject(value, label) {
  if (!value) {
    return undefined;
  }

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

/**
 * Parse an optional JSON array prop.
 *
 * @param {string|Array} value - JSON string or already parsed array.
 * @param {string} label - Human-readable prop label for error messages.
 * @returns {Array|undefined} Parsed array when provided.
 */
export function parseOptionalJsonArray(value, label) {
  if (!value) {
    return undefined;
  }

  return parseRequiredJsonArray(value, label);
}

/**
 * Extract nested records from Luma list responses.
 *
 * @param {object} response - Luma list response.
 * @param {string} key - Nested entry key to unwrap.
 * @returns {Array} Extracted entries.
 */
export function extractEntries(response, key) {
  const entries = response?.entries ?? [];
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.map((entry) => entry?.[key] ?? entry);
}

/**
 * Collect records across cursor-paginated Luma list responses.
 *
 * @param {object} args - Pagination arguments.
 * @param {Function} args.requestPage - Function that fetches a page by cursor.
 * @param {string} args.responseKey - Nested entry key to unwrap.
 * @param {string} args.initialCursor - Initial pagination cursor.
 * @param {number} args.maxPages - Maximum pages to fetch.
 * @returns {Promise<object>} Aggregated pagination result.
 */
export async function collectPaginatedResults({
  requestPage,
  responseKey,
  initialCursor,
  maxPages = 10,
}) {
  const results = [];
  let paginationCursor = initialCursor;
  let nextCursor;
  let hasMore = false;
  let pageCount = 0;

  while (pageCount < maxPages) {
    const response = await requestPage(paginationCursor);
    results.push(...extractEntries(response, responseKey));
    pageCount++;

    hasMore = Boolean(response?.has_more && response?.next_cursor);
    nextCursor = response?.next_cursor;

    if (!hasMore) {
      break;
    }

    paginationCursor = nextCursor;
  }

  return {
    results,
    pageCount,
    hasMore,
    nextCursor,
  };
}
