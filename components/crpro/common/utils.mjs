/**
 * Normalizes a user-supplied deal value into a number the CRPRO API accepts.
 *
 * Pipedream hands string props through untouched, so a blank field arrives as
 * `""` and `Number("")` would silently post a deal worth `0`. A typo arrives as
 * `NaN`, which JSON-serializes to `null`. Both are wrong in a way the caller
 * never sees, so blanks are dropped and anything non-finite throws.
 *
 * @param {string|number|undefined} value - Raw `value` prop.
 * @returns {number|undefined} The parsed amount, or `undefined` when unset.
 * @throws {Error} When the input is present but not a finite number.
 */
export function parseDealValue(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    throw new Error(
      `**Value** must be a number using \`.\` as the decimal separator, e.g. \`1499.90\`. Received \`${trimmed}\`.`,
    );
  }

  return parsed;
}
