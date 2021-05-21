const { google } = require("googleapis");
const google_drive = require("../google_drive/google_drive.app");

module.exports = {
  ...google_drive,
  app: "google_sheets",
  propDefinitions: {
    ...google_drive.propDefinitions,
    cells: {
      type: "string[]",
      label: "Cells / Column Values",
      description: "Use structured mode to enter individual cell values. Disable structured mode to pass an array with each element representing a cell/column value.",
    },
    range: {
      type: "string",
      label: "Range",
      description: "The A1 notation of the values to retrieve. E.g., `A1:E5`",
    },
    rows: {
      type: "string",
      label: "Row Values",
      description: 'Provide an array of arrays. Each nested array should represent a row, with each element of the nested array representing a cell/column value (e.g., passing `[["Foo",1,2],["Bar",3,4]]` will insert two rows of data with three columns each). The most common pattern is to reference an array of arrays exported by a previous step (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will `JSON.parse()` to an array of arrays.',
    },
    sheetID: {
      type: "string",
      label: "Spreadsheet",
      async options({ prevContext, driveId }) {
        const { nextPageToken } = prevContext;
        return this.listSheets(driveId, nextPageToken);
      },
    },
    sheetName: {
      type: "string",
      label: "Sheet Name",
      async options({ sheetId }) {
        const { sheets } = await this.getSpreadsheet(sheetId)
        return sheets.map(sheet => sheet.properties.title)
      },
    },
    worksheetIDs: {
      type: "string[]",
      label: "Worksheets to watch for changes",
      async options({ sheetId }) {
        const { sheets } = await this.getSpreadsheet(sheetId);

        // Only consider "grid" worksheets, which is the only supported use case
        // at the moment. For more information, see the Google API docs:
        // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#SheetType
        return sheets
          .map(({ properties }) => properties)
          .filter(({ sheetType }) => sheetType === 'GRID')
          .map(({ title, sheetId }) => ({
            label: title,
            value: sheetId,
          }));
      },
    },
  },
  methods: {
    ...google_drive.methods,
    sheets() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: this.$auth.oauth_access_token });
      return google.sheets({ version: "v4", auth });
    },
    async listSheets(driveId, pageToken = null) {
      const q = "mimeType='application/vnd.google-apps.spreadsheet'";
      let request = { q };
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
      return this.listFiles(request);
    },
    async getSpreadsheet(spreadsheetId, fields = []) {
      const sheets = this.sheets();
      const request = {
        spreadsheetId,
        fields: fields.join(","),
      };
      return (await sheets.spreadsheets.get(request)).data;
    },
    // returns a range of values for a particular spreadsheet
    async getSpreadsheetValues(spreadsheetId, range) {
      const sheets = this.sheets();
      const request = {
        spreadsheetId,
        range,
      };
      const { data } = await sheets.spreadsheets.values.get(request);

      // If the range is only composed of empty rows, then the response will not
      // contain the `values` attribute, so we set it to an empty array by
      // default to keep the returned value consistent.
      return {
        values: [],
        ...data,
      };
    },
    async getWorksheetRowCounts(spreadsheetId, worksheetIds) {
      const values = await this.getSheetValues(spreadsheetId, worksheetIds);
      return values
        .map(({ values, worksheetId }) => ({
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
    // returns an array of the spreadsheet values for the spreadsheet selected
    async getSheetValues(spreadsheetId, worksheetIds) {
      const { sheets } = await this.getSpreadsheet(spreadsheetId);
      const worksheetIdsSet = new Set(worksheetIds);
      return Promise.all(
        sheets
          .map(({ properties: { sheetId, title } }) => ({
            sheetId,
            title,
          }))
          .filter(({ sheetId }) => worksheetIdsSet.has(sheetId.toString()))
          .map(async ({ sheetId, title }) => {
            const { values } = await this.getSpreadsheetValues(spreadsheetId, title);
            return {
              spreadsheetId,
              values,
              worksheetId: sheetId,
            };
          })
      );
    },
  },
};
