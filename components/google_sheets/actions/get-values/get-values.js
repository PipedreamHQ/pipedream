const axios = require('axios')
const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-get-values",
  name: "Get Values",
  description: "Get all values from a sheet.",
  version: "0.0.11",
  type: "action",
  props: {
    googleSheets,
    drive: { 
      propDefinition: [
        googleSheets, 
        "watchedDrive"
      ],
      description: "", 
    },
    sheetId: { 
      propDefinition: [
        googleSheets, 
        "sheetID",
        (c) => ({
          driveId: c.drive === "myDrive" ? null : c.drive,
        }),
      ] 
    },
    sheetName: { propDefinition: [googleSheets, "sheetName", (c) => ({ sheetId: c.sheetId })] },
  }, 
  async run() {
    const sheets = this.googleSheets.sheets()

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}`
    })).data.values
  },
}