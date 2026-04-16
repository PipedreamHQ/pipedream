/**
 * Parses a string that may be strict JSON or a JS object literal
 * (with unquoted keys). Unquoted keys are normalized to quoted keys
 * before parsing.
 *
 * @param {string} str
 * @returns {any}
 */
function parseJsonLike(str) {
  try {
    return JSON.parse(str);
  } catch {
    // Normalize JS object literal syntax: quote unquoted keys
    const normalized = str.replace(/([{,]\s*)(\w+)\s*:/g, "$1\"$2\":");
    return JSON.parse(normalized);
  }
}

/**
 * Parses the captions prop which can be provided as:
 * - A JSON string (or JS object literal string) representing an array of caption objects
 * - An array of strings, each being a JSON/JS-encoded caption object
 * - An array of caption objects (returned as-is)
 *
 * Each caption object should have: start, end, text, emoji
 *
 * @param {string|string[]|object[]} captions
 * @returns {object[]|undefined}
 */
export function parseCaptions(captions) {
  if (!captions) {
    return undefined;
  }

  if (typeof captions === "string") {
    try {
      return parseJsonLike(captions);
    } catch {
      return captions;
    }
  }

  if (Array.isArray(captions)) {
    return captions.map((item) => {
      if (typeof item === "object") {
        return item;
      }
      try {
        return parseJsonLike(item);
      } catch {
        return item;
      }
    });
  }

  return captions;
}
