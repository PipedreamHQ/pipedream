import {
  ODATA_FUNCTIONS, ODATA_OPERATORS,
} from "./constants.mjs";

/**
 * Returns true if `filter` contains at least one OData comparison operator or
 * function call. Logical words alone ("and", "or", "not") are not enough.
 */
function looksLikeOData(filter) {
  const lower = ` ${filter.toLowerCase()} `;
  return ODATA_OPERATORS.some((op) => lower.includes(op))
    || ODATA_FUNCTIONS.some((fn) => lower.includes(fn));
}

/**
 * The OneNote API doesn't support `$search`, only `$filter`. Turns a free-text
 * `search` into a case-insensitive `contains` filter on `property` and joins it
 * with the caller's own OData `filter` using `and`. Returns undefined if both are empty.
 */
function buildSearchFilter({
  search, filter, property = "displayName",
}) {
  const parts = [];
  if (search) {
    const escaped = search.toLowerCase().replace(/'/g, "''");
    parts.push(`contains(tolower(${property}), '${escaped}')`);
  }
  if (filter) {
    parts.push(`(${filter})`);
  }
  return parts.length
    ? parts.join(" and ")
    : undefined;
}

/**
 * Graph returns HTTP 400, code 20266 ("maximum number of sections is exceeded")
 * from account-wide page queries on accounts with many sections.
 */
function isSectionLimitError(err) {
  const body = err?.response?.data;
  const text = [
    err?.message,
    typeof body === "string"
      ? body
      : JSON.stringify(body ?? ""),
  ].join(" ");
  return /\b20266\b/.test(text);
}

/**
 * Sorts OneNote items by an OData `$orderby` string (e.g. `title, createdDateTime desc`).
 * Defaults to last modified, newest first, which is OneNote's default order for pages.
 * Items missing a field sort first in ascending order.
 */
function sortByOrderBy(items, orderby = "lastModifiedDateTime desc") {
  const keys = orderby
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [
        field,
        direction,
      ] = part.split(/\s+/);
      return {
        field,
        sign: direction?.toLowerCase() === "desc"
          ? -1
          : 1,
      };
    });
  return [
    ...items,
  ].sort((a, b) => {
    for (const {
      field, sign,
    } of keys) {
      const x = a[field];
      const y = b[field];
      if (x === y) continue;
      if (x == null) return -sign;
      if (y == null) return sign;
      return x < y
        ? -sign
        : sign;
    }
    return 0;
  });
}

/**
 * True for an HTTP 429 (Too Many Requests) error from Graph.
 */
function isThrottleError(err) {
  return err?.response?.status === 429 || /\b429\b/.test(err?.message ?? "");
}

export default {
  looksLikeOData,
  buildSearchFilter,
  isSectionLimitError,
  isThrottleError,
  sortByOrderBy,
};
