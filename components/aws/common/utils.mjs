import { nanoid } from "nanoid";

/**
   * This function creates a unique name composed of the component ID and
   * another random ID. The component is included so it's clear to the user
   * which component created the resources. The short ID (the random part) is
   * included because these resources are destroyed and created on component
   * updates, and we hit race conditions trying to delete and re-create a
   * resource with the exact same name.
   *
   * @returns a random string that can be used as a unique name
   */
function generateRandomUniqueName() {
  const { PD_COMPONENT: componentId } = process.env;
  const randomPart = nanoid();
  return `pd-${componentId}-${randomPart}`;
}
/**
   * A utility function that accepts a string as an argument and reformats it in
   * order to remove newline characters and consecutive spaces. Useful when
   * dealing with very long templated strings that are split into multiple lines.
   *
   * @example
   * // returns "This is a much cleaner string"
   * toSingleLineString(`
   *   This is a much
   *   cleaner string
   * `);
   *
   * @param {string}  multiLineString the input string to reformat
   * @returns a formatted string based on the content of the input argument,
   * without newlines and multiple spaces
   */
function toSingleLineString(multiLineString) {
  return multiLineString
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ");
}

/**
 * This function receives an array of strings and transforms it into an object with
 * key/value pairs from each string
 *
 * https://stackoverflow.com/questions/42974735/create-object-from-array
 *
 * @param {string[]} array array of strings
 * @returns object
 */
function createObjectFromArray(array) {
  return array.reduce((o, v) => ({
    ...o,
    [v]: v,
  }), {});
}

export {
  generateRandomUniqueName,
  toSingleLineString,
  createObjectFromArray,
};
