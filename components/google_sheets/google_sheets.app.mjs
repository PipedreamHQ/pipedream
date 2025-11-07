import sheets from "@googleapis/sheets";
import googleDrive from "@pipedream/google_drive";
import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import isArray from "lodash/isArray.js";
import isEmpty from "lodash/isEmpty.js";
import isString from "lodash/isString.js";
import {
  INSERT_DATA_OPTION, VALUE_INPUT_OPTION,
} from "./common/constants.mjs";

export default {
  ...googleDrive,
  app: "google_sheets",
  propDefinitions: {
    ...googleDrive.propDefinitions,
    cell: {
      type: "string",
      label: "Cell Number",
      description: "The A1 notation of the cell. E.g., `A1`",
    },
    cells: {
      type: "string[]",
      label: "Cells / Column Values",
      description: "Enter individual cell values or a custom expression to pass an array with each element representing a cell/column value.",
    },
    range: {
      type: "string",
      label: "Range",
      description: "The A1 notation of the values to retrieve. E.g., `A1:E5`",
    },
    column: {
      type: "string",
      label: "Column Letter",
      description: "Column Letter",
    },
    row: {
      type: "integer",
      label: "Row Number",
      description: "Row Number",
    },
    rows: {
      type: "string",
      label: "Row Values",
      description: "Provide an array of arrays",
    },
    rowsDescription: {
      type: "alert",
      alertType: "neutral",
      content: "Each nested array should represent a row, with each element of the nested array representing a cell/column value (e.g., passing `[[\"Foo\",1,2],[\"Bar\",3,4]]` will insert two rows of data with three columns each). The most common pattern is to reference an array of arrays exported by a previous step (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will `JSON.parse()` to an array of arrays.",
    },
    headersDisplay: {
      type: "alert",
      alertType: "info",
      content: "",
      hidden: true,
    },
    sheetID: {
      type: "string",
      label: "Spreadsheet ID",
      description: "Select a spreadsheet or provide a spreadsheet ID",
      useQuery: true,
      options({
        query,
        prevContext,
        driveId,
        fetchOnlyOwned,
      }) {
        const { nextPageToken } = prevContext;
        return this.listSheetsOptions(driveId, nextPageToken, query, fetchOnlyOwned);
      },
    },
    worksheetIDs: {
      type: "integer",
      label: "Worksheet ID",
      description: "Select a worksheet or provide a worksheet ID",
      async options({ sheetId }) {
        const { sheets } = await this.getSpreadsheet(sheetId);

        // Only consider "grid" worksheets, which is the only supported use case
        // at the moment. For more information, see the Google API docs:
        // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#SheetType
        return sheets
          .map(({ properties }) => properties)
          .filter(({ sheetType }) => sheetType === "GRID")
          .map(({
            title,
            sheetId,
          }) => ({
            label: title,
            value: sheetId,
          }));
      },
    },
  },
  methods: {
    ...googleDrive.methods,

    /**
     * Retrieves the sheet ID corresponding to the provided sheet name from a spreadsheet.
     *
     * @async
     * @param {string} spreadsheetId - The ID of the target spreadsheet.
     * @param {string} sheetName - The name of the sheet to retrieve the ID for.
     * @returns {Promise<number>} The ID of the sheet matching the provided name.
     * @throws Will throw an error if the sheet name is not found.
     */
    async _getSheetIdFromName(spreadsheetId, sheetName) {
      const { sheets } = await this.getSpreadsheet(spreadsheetId);
      for (let sheet of sheets) {
        if (sheet.properties.title === sheetName) {
          return sheet.properties.sheetId;
        }
      }
      throw new Error("Sheet name not found");
    },

    /**
     * Parses a range string into its components:
     * sheet name, start column, end column, start row, and end row.
     *
     * @param {string} rangeStr - The range string in the format "SheetName!A1:B10".
     * @returns {Object} An object with parsed components:
     * { sheetName, startCol, endCol, startRow, endRow }.
     */
    _parseRangeString(rangeStr) {
      // Remove any single quotes
      const sanitizedRangeStr = rangeStr.replace(/'/g, "");

      const [
        sheetName,
        range,
      ] = sanitizedRangeStr.split("!");
      const [
        startCoord,
        endCoord,
      ] = range.split(":");
      const startCol = startCoord.replace(/\d/g, "");
      const endCol = endCoord
        ? endCoord.replace(/\d/g, "")
        : startCol;
      const startRow = parseInt(startCoord.replace(/\D/g, ""), 10) - 1; // 0-based index
      const endRow = endCoord
        ? parseInt(endCoord.replace(/\D/g, ""), 10)
        : startRow;

      return {
        sheetName,
        startCol,
        endCol,
        startRow,
        endRow,
      };
    },

    sanitizedArray(value) {
      if (isArray(value)) {
        return value.map((item) => get(item, "value", item));
      }

      // If is string, try to convert it in an array
      if (isString(value)) {
        // Return an empty array if string is empty
        if (isEmpty(value)) {
          return [];
        }

        return value
          // Remove square brackets from ends ([ "foo", 5 ] ->  "foo", 5 )
          .replace(/(^\[)|(]$)/g, "")
          .trim() // ( "foo", 5  -> "foo", 5)
          // Remove quotes from ends ("foo", 5  ->  foo", 5)
          .replace(/^["']|["']$/g, "")
          // Split on quotes, whitespace, and comma (foo", 5 ->  ["foo","5"])
          .split(/["']?\s*,\s*["']?/);
      }

      throw new Error(`${value} is not an array or an array-like`);
    },
    arrayValuesToString(arr) {
      const convertedIndexes = [];

      const res = arr.map((val, i) => {
        if (![
          "string",
          "number",
          "boolean",
        ].includes(typeof val)) {
          convertedIndexes.push(i) ;
          return JSON.stringify(val);
        }
        return val;
      });

      return {
        arr: res,
        convertedIndexes,
      };
    },
    sheets() {
      const auth = new sheets.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return sheets.sheets({
        version: "v4",
        auth,
      });
    },
    /**
     * Builds a formula using the Google Sheets [MATCH
     * function]{@see {@link https://support.google.com/docs/answer/3093378}}. If a range with both
     * height and width greater than 1 is used, `MATCH` will return `#N/A!`.
     *
     * @param {string} searchKey - The value to search for. For example, 42, "Cats", or I24.
     * @param {string} sheetName - The name of the sheet containing the range to search
     * @param {object} [opts={}] - Additional options used to build the match formula
     * @param {string} [opts.row=""] - The row of the range to search
     * @param {string} [opts.startRow=opts.row] - The starting row of the range to search
     * @param {string} [opts.endRow=opts.row] - The ending row of the range to search
     * @param {string} [opts.column=""] - The column of the range to search
     * @param {string} [opts.startColumn=opts.column] - The starting column of the range to search
     * @param {string} [opts.endColumn=opts.column] - The ending column of the range to search
     * @param {number} [opts.searchType=1] - The manner in which to search. `1`, the default,
     * causes `MATCH` to assume that the range is sorted in ascending order and return the largest
     * value less than or equal to `searchKey`. `0` indicates exact match. -`1` causes `MATCH` to
     * assume that the range is sorted in descending order and return the smallest value greater
     * than or equal to `searchKey`.
     * @returns {string} The match formula
     */
    buildMatchFormula(searchKey, sheetName, {
      row = "",
      startRow = row,
      endRow = row,
      column = "",
      startColumn = column,
      endColumn = column,
      searchType = 1,
    } = {}) {
      return `=MATCH(${searchKey}, '${sheetName}'!${startColumn}${startRow}:${endColumn}${endRow}, ${searchType})`;
    },
    /**
     * Converts column letter(s) (E.g. 'A', 'B', 'AA', etc.) into a numerical value representing
     * the columnIndex of the column.
     * @returns {integer} The columnIndex of the column
     * @param {string} column - The column letter(s)
     */
    _getColumnIndex(column) {
      let sum = 0;
      for (const col of column) {
        sum *= 26;
        sum += col.charCodeAt(0) - "A".charCodeAt(0) + 1;
      }
      return sum;
    },
    async listSheetsOptions(driveId, pageToken = null, query, fetchOnlyOwned) {
      const searchQuery = query
        ? ` and name contains '${query}'`
        : "";
      const q = fetchOnlyOwned
        ? `mimeType='application/vnd.google-apps.spreadsheet'${searchQuery} and 'me' in owners`
        : `mimeType='application/vnd.google-apps.spreadsheet'${searchQuery}`;
      let request = {
        q,
      };
      if (driveId) {
        request = {
          ...request,
          corpora: "drive",
          driveId,
          pageToken,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }
      return this.listFilesOptions(pageToken, request);
    },
    async getSpreadsheet(spreadsheetId, fields = [], extraOpts = {}) {
      const sheets = this.sheets();
      const request = {
        spreadsheetId,
        fields: fields.join(","),
        ...extraOpts,
      };
      return (await sheets.spreadsheets.get(request)).data;
    },
    /**
     * Returns a range of values for a particular spreadsheet. If the range is
     * only composed of empty rows, then the response will not contain the `values`
     * attribute, so we set it to an empty array by default to keep the returned
     * value consistent.
     * @returns {Object} An object containing a `values` attribute containing the list
     * of values in the specified cell range (or an empty list in the case of empty cells)
     * @param {string} spreadsheetId - Id of the spreadsheet.
     * @param {string} range - Spreadsheet range in A1 notation.
     */
    async getSpreadsheetValues(spreadsheetId, range) {
      const sheets = this.sheets();
      const request = {
        spreadsheetId,
        range,
      };
      const { data } = await sheets.spreadsheets.values.get(request);
      return {
        values: [],
        ...data,
      };
    },
    async getWorksheetRowCounts(spreadsheetId, worksheetIds) {
      const values = await this.getSheetValues(spreadsheetId, worksheetIds);
      return values.map(({
        values,
        worksheetId,
      }) => ({
        rowCount: values.length,
        worksheetId,
      }));
    },
    async getWorksheetLength(spreadsheetId) {
      const fields = [
        "sheets.properties.sheetId",
        "sheets.properties.gridProperties.rowCount",
      ];
      const { sheets } = await this.getSpreadsheet(spreadsheetId, fields);
      return sheets
        .map(({
          properties: {
            sheetId,
            gridProperties: { rowCount = 0 } = {},
          } = {},
        }) => ({
          spreadsheetId,
          worksheetId: sheetId,
          worksheetLength: rowCount,
        }));
    },
    /**
     * Returns an array of the spreadsheet values for the spreadsheet selected.
     * @returns {array} An array of objects containing a `values` attribute along with
     * the respective spreadsheet and worksheet Ids for each of the specified worksheets
     * @param {string} spreadsheetId - Id of the spreadsheet to get values from
     * @param {string} worksheetIds - Ids of the worksheets within the spreadsheet
     * to get values from.
     */
    async getSheetValues(spreadsheetId, worksheetIds) {
      const { sheets } = await this.getSpreadsheet(spreadsheetId);
      const worksheetIdsSet = new Set(worksheetIds);
      return Promise.all(
        sheets
          .map(({
            properties: {
              sheetId,
              title,
            },
          }) => ({
            sheetId,
            title,
          }))
          .filter(({ sheetId }) => worksheetIdsSet.has(sheetId.toString()))
          .map(async ({
            sheetId,
            title,
          }) => {
            const { values } = await this.getSpreadsheetValues(
              spreadsheetId,
              title,
            );
            return {
              spreadsheetId,
              values,
              worksheetId: sheetId,
            };
          }),
      );
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create
     *
     * Creates a new spreadsheet and returns the newly created instance of Spreadsheet.
     * @returns {object} The new Spreadsheet instance.
     * @param {object} request - Contains an instance of Spreadsheet.
     */
    async createSpreadsheet(request) {
      const sheets = this.sheets();
      return (await sheets.spreadsheets.create(request)).data;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update
     *
     * Updates a spreadsheet and returns a response body containing an instance of
     * UpdateValuesResponse.
     * @returns {object} An instance of UpdateValuesResponse.
     * @param {object} request - Contains an instance of ValueRange.
     */
    async updateSpreadsheet(request) {
      const sheets = this.sheets();
      return (await sheets.spreadsheets.values.update(request)).data;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
     *
     * Updates a spreadsheet and returns an object containing information about the changes made.
     * @returns {object} An object with information about the changes made.
     * @param {object} request - An object containing information about what to update.
     */
    async batchUpdate(request) {
      const sheets = this.sheets();
      return (await sheets.spreadsheets.batchUpdate(request)).data;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.sheets/copyTo
     *
     * Copies a worksheet and returns the properties of the newly created sheet.
     * @returns {object} Contains an instance of SheetProperties.
     * @param {object} request - An object containing information about the worksheet to copy
     * and the destination of the new worksheet.
     */
    async copyWorksheet(request) {
      const sheets = this.sheets();
      return (await sheets.spreadsheets.sheets.copyTo(request)).data;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/insertDimension
     *
     * Inserts a dimension and returns the properties of the newly inserted dimension.
     * @returns {object} Contains an instance of DimensionProperties.
     * @param {string} spreadsheetId - ID of the spreadsheet in which to insert a dimension.
     * @param {object} data - An object containing information about the dimension to insert.
     */
    async insertDimension(spreadsheetId, data = {}) {
      return (await this.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              insertDimension: data,
            },
          ],
        },
      })).replies[0];
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/moveDimension
     *
     * Moves a dimension and returns the properties of the newly moved dimension.
     * @returns {object} Contains an instance of DimensionProperties.
     * @param {string} spreadsheetId - ID of the spreadsheet in which to move a dimension.
     * @param {object} data - An object containing information about the dimension to move.
     */
    async moveDimension(spreadsheetId, data = {}) {
      return (await this.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              moveDimension: data,
            },
          ],
        },
      })).replies[0];
    },
    /**
     * https://developers.google.com/drive/api/v3/reference/files/copy
     *
     * Copies a spreadsheet and returns a Files resource in the response body.
     * @returns {object} Contains an instance of Files.
     * @param {string} fileId - The ID of the file to copy.
     * @param {string} name - The name of the new spreadsheet.
     */
    async copySpreadsheet(fileId, name) {
      const drive = this.drive();
      const resource = {
        name,
      };
      return (
        await drive.files.copy({
          fileId,
          fields: "*",
          supportsAllDrives: true,
          resource,
        })
      ).data;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear
     *
     * Clears values from a spreadsheet and returns an object with spreadsheetId and clearedRange.
     * @returns {object} An object containing the spreadsheetId and clearedRange.
     * @param {object} request - An object containing the spreadsheetId and the range to
     * clear in A1 notation.
     */
    async clearSheetValues(request) {
      const sheets = this.sheets();
      return (await sheets.spreadsheets.values.clear(request)).data;
    },
    async addRowsToSheet({
      $ = this, spreadsheetId, range, rows, params,
    }) {
      const resp = await axios($, {
        method: "POST",
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${range}!A:A`)}:append`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        validateStatus: () => true,
        params: {
          valueInputOption: VALUE_INPUT_OPTION.USER_ENTERED,
          insertDataOption: INSERT_DATA_OPTION.INSERT_ROWS,
          ...params,
        },
        data: {
          values: rows,
        },
        returnFullResponse: true,
      });
      if (resp.status >= 400) {
        throw new Error(JSON.stringify(resp.data));
      }
      return resp.data.updates;
    },
    /**
   * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
   *
   * Sets values in one or more ranges of a spreadsheet
   * @param {string} spreadsheetId - ID of the spreadsheet
   * @param {array} data - Array of ValueRange objects with which to update the spreadsheet
   * @param {object} [opts={}] - An object containing extra options to pass to the API call as
   * defined in the [API docs](https://bit.ly/3CQzXCw)
   * @returns An object containing an array of UpdateValuesResponse (`responses`)
   */
    async batchUpdateValues(spreadsheetId, data, opts = {}) {
      const sheets = this.sheets();
      return (await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          data,
          ...opts,
        },
      })).data;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#AddSheetRequest
     *
     * Creates a worksheet in a spreadsheet and returns the properties of the newly created
     * worksheet
     * @param {string} spreadsheetId - ID of the spreadsheet in which to create a worksheet
     * @param {object} [properties={}] - The properties the new sheet should have
     * @returns An object containing the SheetProperties (`properties`) of the newly created
     * worksheet
     */
    async createWorksheet(spreadsheetId, properties = {}) {
      return (await this.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties,
              },
            },
          ],
        },
      })).replies[0].addSheet;
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#DeleteSheetRequest
     *
     * Deletes a worksheet
     * @param {string} spreadsheetId - ID of the spreadsheet
     * @param {string} sheetId - ID of the worksheet to delete
     */
    async deleteWorksheet(spreadsheetId, sheetId) {
      return (await this.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteSheet: {
                sheetId,
              },
            },
          ],
        },
      })).replies[0].deleteSheet;
    },
    /**
     * Updates a row in a spreadsheet and returns a response body containing an instance of
     * UpdateValuesResponse
     * @param {string} spreadsheetId - ID of the spreadsheet
     * @param {string} sheetName - Name of the worksheet
     * @param {number} row - Row number to update
     * @param {string[]} values - Array of values with which to update the row
     * @returns An instance of UpdateValuesResponse
     */
    async updateRow(spreadsheetId, sheetName, row, values) {
      return await this.updateSpreadsheet({
        spreadsheetId,
        range: `${sheetName}!${row}:${row}`,
        valueInputOption: VALUE_INPUT_OPTION.USER_ENTERED,
        resource: {
          values: [
            values,
          ],
        },
      });
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
     *
     * Get a ValueRange object from a sheet name, row, column, and array of values
     * @param {string} sheetName - Name of the worksheet
     * @param {number} row - The row number (>=1) of the cell to update
     * @param {string} column - The column letter of the cell to update
     * @param {string} value - The new value of the cell
     * @returns An ValueRange object
     */
    getValueRange(sheetName, row, column, value) {
      return {
        range: `${sheetName}!${column}${row}:${column}${row}`,
        values: [
          [
            value,
          ],
        ],
      };
    },
    /**
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
     *
     * Updates individual cells in a row using column-value pairs
     * @param {string} spreadsheetId - ID of the spreadsheet
     * @param {string} sheetName - Name of the worksheet
     * @param {number} row - The row in which to update cells
     * @param {object} updates - An object whose keys are column letters and values are new cell
     * values
     * @returns An object containing an array of UpdateValuesResponse (`responses`)
     */
    async updateRowCells(spreadsheetId, sheetName, row, updates) {
      const updateData = Object.keys(updates)
        .map((k) => this.getValueRange(sheetName, row, k, updates[k]));
      return await this.batchUpdateValues(
        spreadsheetId,
        updateData,
        {
          valueInputOption: VALUE_INPUT_OPTION.USER_ENTERED,
        },
      );
    },

    /**
     * https://developers.google.com/sheets/api/samples/formatting
     *
     * Resets the format
     * (line style, background, foreground color, font size,
     * bold, italic, strikethrough, horizontalAlignment)
     * of a specified range in a spreadsheet.
     *
     * @async
     * @param {string} spreadsheetId - The ID of the target spreadsheet.
     * @param {string} rangeStr - The range string in the format "SheetName!A1:B10".
     * @param {Object} [opts={}] - Optional additional configurations for the batchUpdate request.
     * @returns {Promise<Object>} The response data from the batchUpdate request.
     */
    async resetRowFormat(spreadsheetId, rangeStr, opts = {}) {
      const ASCII_A = 65;    // Unicode (UTF-16) value for the character 'A'
      const OFFSET_INCLUSIVE = -1;  // For making the end column index inclusive

      const {
        sheetName,
        startCol,
        endCol,
        startRow,
        endRow,
      } = this._parseRangeString(rangeStr);

      // Get the sheetId using the parsed sheetName
      const sheetId = await this._getSheetIdFromName(spreadsheetId, sheetName);
      const sheets = this.sheets();

      const range = {
        sheetId: sheetId,
        startRowIndex: startRow,
        endRowIndex: endRow,
        startColumnIndex: startCol.charCodeAt(0) - ASCII_A,
        endColumnIndex: endCol.charCodeAt(0) - (ASCII_A + OFFSET_INCLUSIVE),
      };
      return (await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateBorders: {
                range,
                top: {
                  style: "NONE",
                },
                bottom: {
                  style: "NONE",
                },
                left: {
                  style: "NONE",
                },
                right: {
                  style: "NONE",
                },
                innerHorizontal: {
                  style: "NONE",
                },
                innerVertical: {
                  style: "NONE",
                },
              },
            },
            {
              repeatCell: {
                range,
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { // assuming white as the default background color
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                    textFormat: {
                      foregroundColor: { // assuming black as the default foreground color
                        red: 0,
                        green: 0,
                        blue: 0,
                      },
                      fontSize: 10,  // Assuming 10 as the default font size
                      bold: false,
                      italic: false,
                      strikethrough: false,
                    },
                    horizontalAlignment: "LEFT",  // Assuming LEFT as the default horizontal alignment
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat.foregroundColor,textFormat.bold,textFormat.italic,textFormat.strikethrough,textFormat.fontSize,horizontalAlignment)",
              },
            },
          ],
          ...opts,
        },
      })).data;
    },
  },
};
