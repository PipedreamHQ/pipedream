function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Pipedream object props deliver every value as a string. AnyAPI validates each
 * input against the API's JSON Schema, so numbers, booleans, arrays and nested
 * objects have to be restored before the request is sent.
 */
export function parseObjectEntries(value) {
  if (!value) return undefined;
  const obj = typeof value === "string"
    ? JSON.parse(value)
    : value;
  return Object.fromEntries(
    Object.entries(obj).map(([
      key,
      entry,
    ]) => [
      key,
      typeof entry === "string"
        ? optionalParseAsJSON(entry)
        : entry,
    ]),
  );
}
