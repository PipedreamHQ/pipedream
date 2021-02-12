const axios = require('axios')
const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-get-values",
  name: "Get Values from a Sheet",
  version: "0.0.7",
  type: "action",
  props: {
    googleSheets,
    sheetId: { propDefinition: [googleSheets, "sheetID"] },
    sheetName: { propDefinition: [googleSheets, "sheetName", (c) => ({ sheetId: c.sheetId })] },
    range: { propDefinition: [googleSheets, "range"] },
  }, 
  async run() {
    const sheets = this.googleSheets.sheets()

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}!${this.range}`
    })).data
  },
}