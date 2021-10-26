const { default: axios } = require("axios");
const { google } = require("googleapis");
const googleDrive = require("../google_drive/google_drive.app");

module.exports = {
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
      description:
        "Use structured mode to enter individual cell values. Disable structured mode to pass an array with each element representing a cell/column value.",
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
      description:
        "Provide an array of arrays. Each nested array should represent a row, with each element of the nested array representing a cell/column value (e.g., passing `[['Foo',1,2],['Bar',3,4]]` will insert two rows of data with three columns each). The most common pattern is to reference an array of arrays exported by a previous step (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will `JSON.parse()` to an array of arrays.",
    },
    sheetID: {
      type: "string",
      label: "Spreadsheet",
      description: "The Google spreadsheet",
      options({
        prevContext,
        driveId,
      }) {
        const { nextPageToken } = prevContext;
        return this.listSheetsOptions(driveId, nextPageToken);
      },
    },
    sheetName: {
      type: "string",
      label: "Sheet Name",
      description: "Sheet Name",
      async options({ sheetId }) {
        const { sheets } = await this.getSpreadsheet(sheetId);
        return sheets.map((sheet) => sheet.properties.title);
      },
    },
    // TODO: is this a duplicate of the prop above?
    worksheetIDs: {
      type: "string[]",
      label: "Worksheet(s)",
      description: "Worksheet(s)",
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
    sheets() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return google.sheets({
        version: "v4",
        auth,
      });
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
    async listSheetsOptions(driveId, pageToken = null) {
      const q = "mimeType='application/vnd.google-apps.spreadsheet'";
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
    async getSpreadsheet(spreadsheetId, fields = []) {
      const sheets = this.sheets();
      const request = {
        spreadsheetId,
        fields: fields.join(","),
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
        .map(({ properties }) => properties)
        .map(({
          sheetId,
          gridProperties: { rowCount },
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
      spreadsheetId, range, rows,
    }) {
      const resp = await axios({
        method: "POST",
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        validateStatus: () => true,
        params: {
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
        },
        data: {
          values: rows,
        },
      });
      if (resp.status >= 400) {
        throw new Error(JSON.stringify(resp.data));
      }
      return resp.data.updates;
    },
  },
};
