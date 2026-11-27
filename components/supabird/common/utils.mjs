/**
 * Shorten a string for use in summaries.
 * @param {string} [text] - The text to shorten.
 * @param {number} [max] - Maximum length including the ellipsis.
 * @returns {string} The shortened text.
 */
function truncate(text, max = 60) {
  const value = String(text ?? "").replace(/\s+/g, " ")
    .trim();
  return value.length > max
    ? `${value.slice(0, max - 3)}...`
    : value;
}

/**
 * Wait for a number of milliseconds.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>} Resolves after the delay.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert an ISO 8601 date string to a millisecond timestamp.
 * @param {string} [value] - The date string.
 * @returns {number} The timestamp, or the current time when missing or invalid.
 */
function toTimestamp(value) {
  const ts = value
    ? Date.parse(value)
    : NaN;
  return Number.isNaN(ts)
    ? Date.now()
    : ts;
}

export default {
  truncate,
  sleep,
  toTimestamp,
};
