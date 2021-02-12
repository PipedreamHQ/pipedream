const googleSheets = require("../../google_sheets.app");
const axios = require('axios')

module.exports = {
  key: "google_sheets-add-multiple-rows",
  name: "Add Multiple Rows to Sheet",
  description: "Add multiple rows of data to Google Sheets",
  version: "0.0.7",
  type: "action",
  props: {
    googleSheets,
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
      ],
    },
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({ sheetId: c.sheetId })
      ],
    },
    rows: {
      propDefinition: [
        googleSheets,
        "rows",
      ],
    },
  }, 
  async run() {
    const sheets = this.googleSheets.sheets()
    const rows = this.rows
    
    let inputValidated = true

    if (!rows || !rows.length || !Array.isArray(rows)) {
      inputValidated = false
    } else {
      rows.forEach(row => { if(!Array.isArray(row)) { inputValidated = false } })
    }

    // Throw an error if input validation failed
    if(!inputValidated) {
      console.error("Data Submitted:")
      console.error(rows)
      throw new Error("Rows data is not an array of arrays. Please enter an array of arrays in the `Rows` parameter above. If you're trying to send a single rows to Google Sheets, search for the action to add a single row to Sheets or try modifying the code for this step.")
    }

    return (await sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: this.sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: rows,
      },
    })).data.updates
  },
}