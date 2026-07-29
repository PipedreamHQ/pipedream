// Shared helpers for Writer actions.

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
