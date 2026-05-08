import { ConfigurationError } from "@pipedream/platform";

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

export function parseOptionalJsonArray(value, label) {
  if (!value) {
    return undefined;
  }

  return parseRequiredJsonArray(value, label);
}

export function extractEntries(response, key) {
  const entries = response?.entries ?? [];
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.map((entry) => entry?.[key] ?? entry);
}

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
