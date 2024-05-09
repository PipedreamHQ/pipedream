/**
 * This method creates an object composed of the own and inherited enumerable string keyed
 * properties of `object` whose keys are not empty strings
 *
 * @example
 * // returns {}
 * omitEmptykey({ "": "bar" });
 *
 * @param {object} object the source object
 * @param {...*} [object.omittedObj] the properties of `object` whose keys are not empty strings
 * @returns {object} the new object
 */
function omitEmptyKey({
  /* eslint-disable-next-line no-unused-vars */
  "": _, ...omittedObj
} = {}) {
  return omittedObj;
}

/**
 * Taken from {@linkcode ../aws/sources/common/utils.mjs utils.mjs}.
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

function parseArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return false;
    }
    return parsed;
  } catch {
    return false;
  }
}

async function getWorksheetHeaders(ctx, sheetId, worksheetName) {
  const headers = [];
  const { values } = await ctx.googleSheets.getSpreadsheetValues(sheetId, `${worksheetName}!1:1`);
  if (!values[0]?.length) {
    return headers;
  }
  for (let i = 0; i < values[0]?.length; i++) {
    headers.push(values[0][i]);
  }
  return headers;
}

export {
  omitEmptyKey,
  toSingleLineString,
  parseArray,
  getWorksheetHeaders,
};
