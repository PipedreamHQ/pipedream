import { ConfigurationError } from "@pipedream/platform";
import { MAX_CONCURRENT_REQUESTS } from "./constants.mjs";

const ROW_IDS_ERROR = "`Row IDs` must be a comma-separated list of positive integer row IDs or a JSON array of positive integers.";

// Smartsheet IDs are 16-digit integers, and the largest on a live account already sits at
// 97% of Number.MAX_SAFE_INTEGER - past that boundary doubles step by 2 and an odd ID would
// silently become a different record. So IDs are never converted to numbers: they are
// validated as digit strings and sent as strings. The OpenAPI spec types them `number`, but
// the API accepts strings (verified live against /sheets/{id}/rows/copy), which keeps every
// ID exact end to end.
export function toIdString(value, label = "ID") {
  const trimmed = String(value ?? "").trim();
  // Positive digits only. Smartsheet never issues 0 as a resource ID, and every caller here
  // passes a sheet, workspace, folder, or row ID, so `0` is always a configuration mistake
  // that is cheaper to catch locally than to send and have the API reject.
  if (!/^[1-9]\d*$/.test(trimmed)) {
    throw new ConfigurationError(`\`${label}\` must be a numeric Smartsheet ID, but received \`${value}\`.`);
  }
  return trimmed;
}

// Runs `fn` over `items` with at most `limit` in flight. Smartsheet has no bulk endpoint for
// workspace children, so these traversals fan out one request per workspace; unbounded
// Promise.all turns a large account into a burst of hundreds of concurrent requests.
export async function mapWithConcurrency(items, fn, limit = MAX_CONCURRENT_REQUESTS) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({
    length: Math.min(limit, items.length),
  }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) {
        return;
      }
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

export function parseRowIds(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
  // Deliberately not JSON.parse: parsing `[9876543210987655]` would round the ID to an
  // adjacent value before it could be inspected. Both accepted shapes (a JSON array and a
  // comma-separated list) are read as literal digit tokens instead.
  const tokens = raw
    .trim()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!tokens.length || tokens.some((id) => !/^[1-9]\d*$/.test(id))) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
  return tokens;
}
