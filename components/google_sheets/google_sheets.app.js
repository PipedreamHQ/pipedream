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
    async getRowCounts(sheetIds) {
      const sheets = this.sheets();
      const rowCounts = [];
      for (const id of sheetIds) {
        const spreadsheet = await this.getSpreadsheet(id);
        for (const sheet of spreadsheet.sheets) {
          rowCounts.push({
            spreadsheetId: id,
            sheetId: sheet.properties.sheetId,
            rows: sheet.properties.gridProperties.rowCount,
          });
        }
      }
      return rowCounts;
    },
    // returns an array of the spreadsheet values for all sheets selected in props
    async getSheetValues(sheetIds) {
      const sheets = this.sheets();
      const sheetValues = [];
      for (const id of sheetIds) {
        const spreadsheet = await this.getSpreadsheet(id);
        for (const sheet of spreadsheet.sheets) {
          const newValues = (
            await this.getSpreadsheetValues(id, sheet.properties.title)
          ).values;
          sheetValues.push({
            spreadsheetId: id,
            sheetId: sheet.properties.sheetId,
            values: newValues,
          });
        }
      }
      return sheetValues;
    },
  },
};