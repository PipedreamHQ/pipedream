/**
 * Parses a prop value that may be either a JSON string or already a parsed object/array.
 * Returns the value as-is if it's already an object or array, otherwise attempts JSON.parse.
 * Returns undefined if the value is undefined or null.
 */
export const parseObject = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new Error(`parseObject: failed to parse value as JSON — ${err.message}. Received: ${String(value).slice(0, 100)}`);
  }
};
