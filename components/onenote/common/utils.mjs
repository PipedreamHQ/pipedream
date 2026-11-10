import {
  ODATA_FUNCTIONS, ODATA_OPERATORS,
} from "./constants.mjs";

/**
 * Returns true if `filter` contains at least one OData operator or function.
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

export default {
  looksLikeOData,
  buildSearchFilter,
  isSectionLimitError,
};
