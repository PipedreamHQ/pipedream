const { google } = require("googleapis");

module.exports = {
  type: "app",
  app: "google_sheets",
  methods: {
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
    async getRowCounts(spreadsheetId) {
      const sheets = this.sheets();
      const rowCounts = [];
      const spreadsheet = await this.getSpreadsheet(spreadsheetId);
      for (const sheet of spreadsheet.sheets) {
        rowCounts.push({
          spreadsheetId,
          sheetId: sheet.properties.sheetId,
          rows: sheet.data[0].rowData.length,
        });
      }
      return rowCounts;
    },
    // returns an array of the spreadsheet values for the spreadsheet selected
    async getSheetValues(spreadsheetId) {
      const sheets = this.sheets();
      const sheetValues = [];
      const spreadsheet = await this.getSpreadsheet(spreadsheetId);
      for (const sheet of spreadsheet.sheets) {
        const newValues = (
          await this.getSpreadsheetValues(spreadsheetId, sheet.properties.title)
        ).values;
        sheetValues.push({
          spreadsheetId,
          sheetId: sheet.properties.sheetId,
          values: newValues,
        });
      }
      return sheetValues;
    },
  },
};