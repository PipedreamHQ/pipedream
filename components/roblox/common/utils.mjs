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

/**
 * Builds the CEL `filter` expression used by the data store list endpoints to
 * match resources whose ID starts with a prefix. Escapes backslashes and double
 * quotes so a prefix containing those characters can't produce a malformed
 * expression. Returns undefined when no prefix is provided.
 */
export function idPrefixFilter(prefix) {
  if (!prefix) {
    return undefined;
  }
  const escaped = prefix.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  return `id.startsWith("${escaped}")`;
}
