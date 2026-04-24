/**
 * ChooseOne must be a plain object (not an array); arrays pass typeof "object".
 * @param {unknown} value
 * @returns {boolean}
 */
export function isChooseOneObject(value) {
  return (
    value != null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length > 0
  );
}
