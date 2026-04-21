/**
 * Parses a prop value that can be either a JSON string or a plain object.
 * Useful for `type: "object"` props where the platform may deliver the value
 * as a stringified JSON or as a native object depending on how the user
 * configured the step.
 *
 * @param {string|object} value - The prop value to parse.
 * @returns {object|undefined} Parsed object, or undefined if value is falsy.
 */
function parseObject(value) {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    return JSON.parse(value);
  }
  return value;
}

export default {
  parseObject,
};
