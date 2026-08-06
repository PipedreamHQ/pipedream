// Shared helpers for Amplitude actions.

/**
 * Return a shallow copy of `obj` containing only the requested field names
 * (plus `always`, which is force-included regardless of `names`) that are
 * present on the object.
 *
 * @param {object} obj - the source record
 * @param {string[]} names - field names to keep, besides `always`
 * @param {string[]} always - field names always kept if present
 * @returns {object} the plucked record
 */
export const pluck = (obj, names, always = []) => Object.fromEntries(
  [
    ...new Set([
      ...always,
      ...names,
    ]),
  ].filter((k) => k in obj).map((k) => [
    k,
    obj[k],
  ]),
);
