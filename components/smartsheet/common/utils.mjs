import { ConfigurationError } from "@pipedream/platform";
import { MAX_CONCURRENT_REQUESTS } from "./constants.mjs";

const ROW_IDS_TOKENS = /^[1-9]\d*(\s*,\s*[1-9]\d*)*$/;
const ROW_IDS_ERROR = "`Row IDs` must be a comma-separated list of positive integer row IDs or a JSON array of positive integers.";

// IDs are 16 digits and never converted to numbers, so none can round. The spec types them
// `number`, but the API accepts strings.
export function toIdString(value, label = "ID") {
  const trimmed = String(value ?? "").trim();
  // Smartsheet never issues 0, so it is always a config mistake.
  if (!/^[1-9]\d*$/.test(trimmed)) {
    throw new ConfigurationError(`\`${label}\` must be a numeric Smartsheet ID, but received \`${value}\`.`);
  }
  return trimmed;
}

// Bounded fan-out: there is no bulk children endpoint, so a traversal is one request per
// workspace and unbounded Promise.all bursts.
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
  const trimmed = String(raw ?? "").trim();
  // Not JSON.parse: it would round a 16-digit ID before it could be checked. Validate the
  // whole input, then split.
  const inner = trimmed.startsWith("[") && trimmed.endsWith("]")
    ? trimmed.slice(1, -1).trim()
    : trimmed;
  if (!ROW_IDS_TOKENS.test(inner)) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
  return inner.split(",").map((id) => id.trim());
}
