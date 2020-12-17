const { google } = require("googleapis");
const google_drive = require("../google_drive/google_drive.app");

module.exports = {
  ...google_drive,
  methods: {
    ...google_drive.methods,
    sheets() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: this.$auth.oauth_access_token });
      return google.sheets({ version: "v4", auth });
    },
    async getSpreadsheet(spreadsheetId) {
      const sheets = this.sheets();
      const request = {
        spreadsheetId,
        includeGridData: true,
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
      return (await sheets.spreadsheets.values.get(request)).data;
    },
    async getWorksheetRowCounts(spreadsheetId) {
      const rowCounts = [];
      const spreadsheet = await this.getSpreadsheet(spreadsheetId);
      for (const worksheet of spreadsheet.sheets) {
        rowCounts.push({
          spreadsheetId,
          sheetId: worksheet.properties.sheetId,
          rows: worksheet.data[0].rowData ? worksheet.data[0].rowData.length : 0,
        });
      }
      return rowCounts;
    },
    // returns an array of the spreadsheet values for the spreadsheet selected
    async getSheetValues(spreadsheetId, worksheetIds) {
      const sheetValues = [];
      const spreadsheet = await this.getSpreadsheet(spreadsheetId);
      for (const worksheet of spreadsheet.sheets) {
        const { sheetId } = worksheet.properties;
        if (
          Array.isArray(worksheetIds) &&
          !worksheetIds.includes(sheetId)
        ) {
          continue;
        }

        const newValues = (
          await this.getSpreadsheetValues(spreadsheetId, worksheet.properties.title)
        ).values;
        sheetValues.push({
          spreadsheetId,
          sheetId,
          values: newValues,
        });
      }
      return sheetValues;
    },
  },
};
