/**
 * Parses a value that may arrive as a JSON string (from the workflow UI) or as
 * an already-parsed object/array (from agents or the SDK). Returns the value
 * unchanged when it is not a string.
 */
export function parseObject(value) {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
