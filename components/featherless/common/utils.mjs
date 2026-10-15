import { ConfigurationError } from "@pipedream/platform";

/**
 * Strictly parse a decimal-valued string prop to a finite number.
 *
 * Unlike `parseFloat`, which silently accepts partially-numeric input like
 * `"0.7abc"` (→ `0.7`), this requires the ENTIRE value to be a finite number and
 * throws a ConfigurationError otherwise. Empty/undefined/whitespace-only values
 * pass through as `undefined` so optional props stay optional.
 *
 * @param {string|number|undefined|null} value - The raw prop value.
 * @param {string} label - Human-facing prop label used in the error message.
 * @returns {number|undefined} The parsed number, or `undefined` when unset.
 */
export function parseDecimalProp(value, label) {
  if (value === undefined || value === null) {
    return undefined;
  }
  const trimmed = typeof value === "string"
    ? value.trim()
    : value;
  if (trimmed === "") {
    return undefined;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num)) {
    throw new ConfigurationError(`**${label}** must be a valid number, e.g. \`0.7\`.`);
  }
  return num;
}
