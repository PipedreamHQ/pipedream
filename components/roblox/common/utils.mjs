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
 * match resources whose ID starts with a prefix. The data store filtering API
 * doesn't support a `startsWith` function, so the prefix is instead matched
 * with an anchored regex via `matches`. Prefix characters that have special
 * meaning in a regex are escaped so they're matched literally, and the
 * resulting regex is then escaped for embedding in a CEL string literal.
 * Returns undefined when no prefix is provided.
 */
export function idPrefixFilter(prefix) {
  if (!prefix) {
    return undefined;
  }
  const regexEscaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const celEscaped = regexEscaped.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  return `id.matches("^${celEscaped}")`;
}
