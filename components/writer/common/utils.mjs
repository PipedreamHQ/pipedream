// Shared helpers for Writer actions.
import { ConfigurationError } from "@pipedream/platform";

/**
 * Parse a string prop into a float, treating empty/unset input as omitted.
 * Throws a ConfigurationError when the value is a non-numeric string so the
 * user gets clear feedback instead of a silently-ignored NaN being sent to the API.
 *
 * @param {string|undefined} value - the raw prop value
 * @param {string} label - the prop label, used in the error message
 * @returns {number|undefined} the parsed float, or undefined when unset
 */
export function parseFloatProp(value, label) {
  if (value === undefined || value === "") {
    return undefined;
  }
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    throw new ConfigurationError(`**${label}** must be a number, got \`${value}\``);
  }
  return parsed;
}

/**
 * Return a shallow copy of `obj` containing only `id` plus the requested field
 * names that are present on the object. `id` is always included so callers can
 * chain the result into id-taking tools.
 *
 * @param {object} obj - the source record
 * @param {string[]} names - field names to keep (besides `id`)
 * @returns {object} the plucked record
 */
export const pluck = (obj, names) => Object.fromEntries(
  [
    "id",
    ...names,
  ].filter((k) => k in obj).map((k) => [
    k,
    obj[k],
  ]),
);
