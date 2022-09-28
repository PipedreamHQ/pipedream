export default {
  getOwnerAndRepo(repoFullname) {
    const splited = repoFullname.split("/");

    return {
      owner: splited[0],
      repo: splited[0],
    };
  },
};

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
 * @param {string} multiLineString the input string to reformat
 * @returns a formatted string based on the content of the input argument,
 * without newlines and multiple spaces
 */
export function toSingleLineString(multiLineString) {
  return multiLineString
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ");
}
