import { ConfigurationError } from "@pipedream/platform";

/**
 * Parse a JSON-string prop into a JS value.
 *
 * MCP/agent-facing props like `components`, `settings`, and `data` arrive as JSON strings.
 * This centralizes the parsing so every action reports the same clear, prop-named error on
 * malformed input (a raw `JSON.parse` throws a bare `SyntaxError` with no prop context).
 *
 * - Returns `undefined` for empty input (null / undefined / ""), so optional props can be
 *   passed straight through without a caller-side ternary.
 * - Passes an already-parsed object/array through unchanged (defensive).
 *
 * @param {string|object|null|undefined} value - the raw prop value
 * @param {string} propLabel - the prop name, used in the error message
 * @returns {*} the parsed value, or `undefined` when `value` is empty
 * @throws {ConfigurationError} when `value` is a string that is not valid JSON
 */
export function parseJson(value, propLabel = "value") {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new ConfigurationError(
      `The \`${propLabel}\` prop must be a valid JSON string. ${err.message}`,
    );
  }
}

/**
 * Reduce each record in an array to only the named top-level fields.
 *
 * Optional response-shaping for list actions that return large objects (Form.io forms carry
 * big `components`/`access` arrays). When `fields` is empty/undefined the records are returned
 * unchanged, so this is always additive — omitting the `fields` prop reproduces the raw output.
 *
 * @param {Array} records - the array of record objects
 * @param {string[]|undefined} fields - top-level field names to keep
 * @returns {Array} the records, each narrowed to `fields` (or unchanged when `fields` is empty)
 */
export function pluckFields(records, fields) {
  if (!Array.isArray(records) || !fields?.length) {
    return records;
  }
  return records.map((r) => (
    r && typeof r === "object" && !Array.isArray(r)
      ? Object.fromEntries(Object.entries(r).filter(([
        k,
      ]) => fields.includes(k)))
      : r
  ));
}
