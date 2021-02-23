const { google } = require("googleapis");
const google_drive = require("../google_drive/google_drive.app");

module.exports = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    ...google_drive.propDefinitions,
    docId: {
      type: "string",
      label: "Document",
      description:  "Select a document or disable structured mode to pass a value exported from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or to manually enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
      async options({ prevContext, driveId }) {
        const { nextPageToken } = prevContext;
        return this.listDocs(driveId, nextPageToken);
      },
    },
  },
  methods: {
    ...google_drive.methods,
    docs() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: this.$auth.oauth_access_token });
      return google.docs({ version: "v1", auth });
    },
    async listDocs(driveId, pageToken = null) {
      const q = "mimeType='application/vnd.google-apps.document'";
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
    // async getSpreadsheet(spreadsheetId, fields = []) {
    //   const sheets = this.sheets();
    //   const request = {
    //     spreadsheetId,
    //     fields: fields.join(","),
    //   };
    //   return (await sheets.spreadsheets.get(request)).data;
    // },
    // // returns a range of values for a particular spreadsheet
    // async getSpreadsheetValues(spreadsheetId, range) {
    //   const sheets = this.sheets();
    //   const request = {
    //     spreadsheetId,
    //     range,
    //   };
    //   const { data } = await sheets.spreadsheets.values.get(request);

    //   // If the range is only composed of empty rows, then the response will not
    //   // contain the `values` attribute, so we set it to an empty array by
    //   // default to keep the returned value consistent.
    //   return {
    //     values: [],
    //     ...data,
    //   };
    // },
    // async getWorksheetRowCounts(spreadsheetId, worksheetIds) {
    //   const values = await this.getSheetValues(spreadsheetId, worksheetIds);
    //   return values
    //     .map(({ values, worksheetId }) => ({
    //       rowCount: values.length,
    //       worksheetId,
    //     }));
    // },
    // async getWorksheetLength(spreadsheetId) {
    //   const fields = [
    //     "sheets.properties.sheetId",
    //     "sheets.properties.gridProperties.rowCount",
    //   ];
    //   const { sheets } = await this.getSpreadsheet(spreadsheetId, fields);
    //   return sheets
    //     .map(({ properties }) => properties)
    //     .map(({
    //       sheetId,
    //       gridProperties: { rowCount },
    //     }) => ({
    //       spreadsheetId,
    //       worksheetId: sheetId,
    //       worksheetLength: rowCount,
    //     }));
    // },
    // // returns an array of the spreadsheet values for the spreadsheet selected
    // async getSheetValues(spreadsheetId, worksheetIds) {
    //   const { sheets } = await this.getSpreadsheet(spreadsheetId);
    //   const worksheetIdsSet = new Set(worksheetIds);
    //   return Promise.all(
    //     sheets
    //       .map(({ properties: { sheetId, title } }) => ({
    //         sheetId,
    //         title,
    //       }))
    //       .filter(({ sheetId }) => worksheetIdsSet.has(sheetId.toString()))
    //       .map(async ({ sheetId, title }) => {
    //         const { values } = await this.getSpreadsheetValues(spreadsheetId, title);
    //         return {
    //           spreadsheetId,
    //           values,
    //           worksheetId: sheetId,
    //         };
    //       })
    //   );
    // },
  },
};
