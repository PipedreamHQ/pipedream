import { ConfigurationError } from "@pipedream/platform";

/**
 * Parse a JSON-string prop into a JS value, optionally validating its shape.
 *
 * MCP/agent-facing props like `components`, `settings`, and `data` arrive as JSON strings.
 * This centralizes the parsing so every action reports the same clear, prop-named error on
 * malformed input (a raw `JSON.parse` throws a bare `SyntaxError` with no prop context).
 *
 * - Returns `undefined` for empty input (null / undefined / ""), so optional props can be
 *   passed straight through without a caller-side ternary.
 * - Passes an already-parsed object/array through unchanged (defensive).
 * - When `expect` is `"object"` or `"array"`, the parsed value must match that shape, so a
 *   valid-JSON-but-wrong-shape value (e.g. an array where the API wants an object) fails here
 *   with a prop-named message instead of as an opaque 400 from the API.
 *
 * @param {string|object|null|undefined} value - the raw prop value
 * @param {string} propLabel - the prop name, used in the error message
 * @param {"object"|"array"} [expect] - required shape of the parsed value
 * @returns {*} the parsed value, or `undefined` when `value` is empty
 * @throws {ConfigurationError} when `value` is not valid JSON, or does not match `expect`
 */
export function parseJson(value, propLabel = "value", expect) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  let parsed;
  if (typeof value === "object") {
    parsed = value;
  } else {
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      throw new ConfigurationError(
        `The \`${propLabel}\` prop must be a valid JSON string. ${err.message}`,
      );
    }
  }
  if (expect === "object"
    && (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))) {
    throw new ConfigurationError(
      `The \`${propLabel}\` prop must be a JSON object (e.g. \`{ ... }\`).`,
    );
  }
  if (expect === "array" && !Array.isArray(parsed)) {
    throw new ConfigurationError(
      `The \`${propLabel}\` prop must be a JSON array (e.g. \`[ { ... } ]\`).`,
    );
  }
  return parsed;
}

/**
 * Coerce an optional free-text value to a string, passing empty input through.
 *
 * Props declared `type: "string"` can still receive a non-string (e.g. a number) over the
 * SDK/MCP surface, which Form.io answers with a raw 5xx on some fields. Coercing keeps a
 * `path: 12345` from becoming a 500. Empty input (null/undefined) is returned unchanged so an
 * omitted optional prop stays omitted.
 *
 * @param {*} value - the raw prop value
 * @returns {string|undefined} the value as a string, or `undefined` when empty
 */
export function coerceStr(value) {
  return value == null
    ? undefined
    : String(value);
}

/**
 * Validate an optional value is one of `allowed`, passing empty input through.
 *
 * Keeps an out-of-range enum (e.g. a form `type` other than `form`/`resource`) from reaching
 * the API as an opaque 5xx — it fails here with a prop-named, choice-listing error instead.
 *
 * @param {*} value - the raw prop value
 * @param {string} propLabel - the prop name, used in the error message
 * @param {string[]} allowed - the permitted values
 * @returns {*} the value, or `undefined` when empty
 * @throws {ConfigurationError} when `value` is non-empty and not in `allowed`
 */
export function assertEnum(value, propLabel, allowed) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (!allowed.includes(value)) {
    throw new ConfigurationError(
      `The \`${propLabel}\` prop must be one of: ${allowed.map((a) => `\`${a}\``).join(", ")}.`,
    );
  }
  return value;
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
