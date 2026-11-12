/**
 * Keep only the named fields of each object. `id` is always kept so results can be chained
 * into follow-up tools.
 */
function pluck(item, names) {
  const keys = [
    "id",
    ...names,
  ];
  return Object.fromEntries(
    keys.filter((key) => key in item).map((key) => [
      key,
      item[key],
    ]),
  );
}

/**
 * Parse a prop that holds a JSON object (or array) as a string. Returns `undefined` for empty
 * input; throws a readable error when the string isn't valid JSON of the expected shape.
 */
function parseJson(value, label, { array = false } = {}) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return value;
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (err) {
    throw new Error(`${label} must be valid JSON: ${err.message}`);
  }
  const isArray = Array.isArray(parsed);
  if (array
    ? !isArray
    : (isArray || typeof parsed !== "object" || parsed === null)) {
    throw new Error(`${label} must be a JSON ${array
      ? "array"
      : "object"}`);
  }
  return parsed;
}

/** Accepts a unix timestamp (seconds), a number-like string, or an ISO date/datetime. */
function toUnixSeconds(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (/^\d{9,11}$/.test(String(value))) return Number(value);
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) {
    throw new Error(`Cannot read "${value}" as a date. Use ISO 8601, e.g. 2026-11-01 or 2026-11-01T09:00:00Z.`);
  }
  return Math.floor(ms / 1000);
}

/** Comma-join a list of ids/values for TestRail's `a=1,2,3` filter params. */
function csv(values) {
  if (!values || !values.length) return undefined;
  return values.map((v) => String(v).trim()).join(",");
}

export default {
  pluck,
  parseJson,
  toUnixSeconds,
  csv,
};
