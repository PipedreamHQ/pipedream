/**
 * Utilities for AI-optimized Google Sheets tools.
 * Handles header-to-object and object-to-array conversions
 * so LLMs can pass rows as JSON objects with header keys.
 */

/**
 * Get headers (row 1) from a worksheet.
 * @param {object} app - the Google Sheets app instance
 * @param {string} spreadsheetId - the spreadsheet ID
 * @param {string} sheetName - the worksheet name
 * @returns {string[]} array of header values
 */
export async function getHeaders(app, spreadsheetId, sheetName) {
  const escaped = sheetName.replace(/'/g, "''");
  const range = `'${escaped}'!1:1`;
  const { values } = await app.getSpreadsheetValues(
    spreadsheetId,
    range,
  );
  return values?.[0] || [];
}

/**
 * Convert a row object (header keys) to a positional array.
 * Missing columns get empty string.
 * @param {string[]} headers - column headers
 * @param {object} rowObj - row data as {headerKey: value}
 * @returns {string[]} positional array of values
 */
export function rowObjectToArray(headers, rowObj) {
  return headers.map((header) => {
    const val = rowObj[header];
    return val !== undefined && val !== null
      ? String(val)
      : "";
  });
}

/**
 * Convert rows (array of arrays) to array of objects using
 * headers. Each object also gets a _rowNumber field.
 * @param {string[]} headers - column headers from row 1
 * @param {Array[]} rows - data rows (without header row)
 * @param {number} startRow - the starting row number
 *   (default 2, since row 1 is headers)
 * @returns {object[]} array of row objects
 */
export function rowsToObjects(headers, rows, startRow = 2) {
  return rows.map((row, index) => {
    const obj = {};
    headers.forEach((header, i) => {
      if (header) {
        obj[header] = row[i] !== undefined
          ? row[i]
          : "";
      }
    });
    obj._rowNumber = startRow + index;
    return obj;
  });
}

/**
 * Parse a row input that can be either an object (header keys)
 * or an array (positional values).
 * @param {string[]} headers - column headers
 * @param {object|Array} row - row data
 * @returns {string[]} positional array of values
 */
export function parseRowInput(headers, row) {
  if (Array.isArray(row)) {
    return row.map((v) => (v !== undefined && v !== null
      ? String(v)
      : ""));
  }
  if (typeof row === "object" && row !== null) {
    return rowObjectToArray(headers, row);
  }
  throw new Error(
    "Each row must be an object (header keys) or an array"
    + " (positional values).",
  );
}
