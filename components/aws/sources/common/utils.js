const { nanoid } = require("nanoid");

module.exports = {
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
  generateRandomUniqueName() {
    const { PD_COMPONENT: componentId } = process.env;
    const randomPart = nanoid();
    return `pd-${componentId}-${randomPart}`;
  },
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
  toSingleLineString(multiLineString) {
    return multiLineString
      .trim()
      .replace(/\n/g, " ")
      .replace(/\s{2,}/g, "");
  },
};
