/**
 * Parses a value into a comma-separated string, handling the different
 * formats a user may provide:
 *   - Array:                ["usd", "eur"]      → "usd,eur"
 *   - JSON array string:    '["usd","eur"]'      → "usd,eur"
 *   - Comma-separated str:  "usd,eur"            → "usd,eur"
 *   - Single string:        "usd"                → "usd"
 *   - Nullish:              null / undefined      → undefined
 *
 * @param {string|string[]|null|undefined} value
 * @returns {string|undefined}
 */
export function parseStringList(value) {
  if (value === null || value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value.join(",");
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.join(",");
        }
      } catch (_) {
        // not valid JSON — fall through and return as-is
      }
    }
    return trimmed;
  }

  return String(value);
}
