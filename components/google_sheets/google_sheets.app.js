const { google } = require("googleapis");
const google_drive = require("../google_drive/google_drive.app");

module.exports = {
  ...google_drive,
  app: "google_sheets",
  propDefinitions: {
    ...google_drive.propDefinitions,
    sheetID: {
      type: "string",
      label: "Spreadsheet to watch for changes",
      async options({ prevContext, driveId }) {
        const { nextPageToken } = prevContext;
        return this.listSheets(driveId, nextPageToken);
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
          .filter(({ sheetType }) => sheetType === "GRID")
          .map(({ title, sheetId }) => ({
            label: title,
            value: sheetId,
          }));
      },
    },
    folders: {
      type: "string[]",
      label: "Folders",
      description:
        "(Optional) The folders you want to watch for changes. Leave blank to watch for any new spreadsheet in the Drive.",
      async options({ prevContext, driveId }) {
        const { nextPageToken } = prevContext;
        let results;
        if (driveId === "myDrive") {
          results = await this.listFiles({
            pageToken: nextPageToken,
            q: "mimeType = 'application/vnd.google-apps.folder'",
          });
        } else {
          results = await this.listFiles({
            pageToken: nextPageToken,
            corpora: "drive",
            driveId,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: "mimeType = 'application/vnd.google-apps.folder'",
          });
        }
        return results;
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
    /**
     * Returns a range of values for a particular spreadsheet. If the range is
     * only composed of empty rows, then the response will not contain the `values`
     * attribute, so we set it to an empty array by default to keep the returned
     * value consistent.
     * @param {string} title - The title of the book.
     * @param {string} author - The author of the book.
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
      return values.map(({ values, worksheetId }) => ({
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
        .map(({ sheetId, gridProperties: { rowCount } }) => ({
          spreadsheetId,
          worksheetId: sheetId,
          worksheetLength: rowCount,
        }));
    },
    /**
     * Returns an array of the spreadsheet values for the spreadsheet selected.
     * @param {string} spreadsheetId - Id of the spreadsheet to get values from
     * @param {string} worksheetIds - Ids of the worksheets within the spreadsheet
     * to get values from.
     */
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
            const { values } = await this.getSpreadsheetValues(
              spreadsheetId,
              title
            );
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