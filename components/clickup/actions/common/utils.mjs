/**
 * Parses a single value that may be a JSON string or a plain object/array.
 *
 * @param {string|object|Array} value
 * @returns {object|Array}
 */
function parseObject(value) {
  if (!value) return undefined;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Invalid JSON: ${value}`);
  }
}

/**
 * Normalizes a custom fields filter input into an array of objects.
 * Handles the following input shapes:
 *   - JSON string of an array:        '[{"field_id":"..."}]'
 *   - Array of JSON strings:          ['{"field_id":"..."}', ...]
 *   - Array of objects:               [{ field_id: "..." }, ...]
 *   - A single object:                { field_id: "..." }
 *
 * @param {string|string[]|object|object[]} value
 * @returns {object[]|undefined}
 */
function parseCustomFields(value) {
  if (!value) return undefined;

  // If it's a plain JSON string, parse it first
  const parsed = typeof value === "string"
    ? parseObject(value)
    : value;

  // Wrap a single object in an array
  const arr = Array.isArray(parsed)
    ? parsed
    : [
      parsed,
    ];

  // Each element may still be a JSON string — parse those too
  return arr.map((item) => (typeof item === "string"
    ? parseObject(item)
    : item));
}

export default {
  parseObject,
  parseCustomFields,
};
