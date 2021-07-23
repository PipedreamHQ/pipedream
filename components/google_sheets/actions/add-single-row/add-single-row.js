const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "pravin-add-single-row",
  name: "Computed Props Test - Add Single Row",
  description: "Add a single row of data to Google Sheets",
  version: "0.0.27",
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
      label: "Spreadsheet",
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: c.drive === "myDrive" ? null : c.drive,
        }),
      ]
    },
    sheetName: { propDefinition: [googleSheets, "sheetName", (c) => ({ sheetId: c.sheetId })] },
    dataEntry: { 
      type: "string",
      options: [
        { label: "Enter data for each column", value: "column" },
        { label: "Pass an array of data", value: "array" }
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.dataEntry == "column") {
      if(!this.header) {
        const rv = {}
        rv['header'] = { 
          type: "string", 
          label: "Header Row?",
          options: [
            { label: "First row has headers", value: "hasHeaders" },
            { label: "There is no header row", value: "noHeaders" },
          ],
          reloadProps: true
        }
        return rv
      } else {
        if(this.header === "hasHeaders") {
          const rv = {}
          rv['header'] = { 
            type: "string", 
            label: "Header Row?",
            options: [
              { label: "First row has headers", value: "hasHeaders" },
              { label: "There is no header row", value: "noHeaders" },
            ],
            reloadProps: true
          }
          const { values } = await this.googleSheets.getSpreadsheetValues(this.sheetId, `${this.sheetName}!1:1`)
          for (let i = 0; i < values[0].length; i++) {
            rv[`col_${i.toString().padStart(4, "0")}`] = { type: "string", label: values[0][i], optional: true }
          }
          return rv
        } else {
          const rv = {}
          rv['header'] = { 
            type: "string", 
            label: "Header Row?",
            options: [
              { label: "First row has headers", value: "hasHeaders" },
              { label: "There is no header row", value: "noHeaders" },
            ],
            reloadProps: true
          }
          rv['myColumnData'] = { type: "string[]", label: "Enter individual columns" }
          return rv
        }
      }
    } else {
      const rv = {}
      rv['mydata'] = { type: "any", label: "Pass an Array" }
      return rv
    }
  },
  async run() {
    const sheets = this.googleSheets.sheets()
    let cells
    console.log(this.dataEntry)
    console.log(this.header)
    if(this.dataEntry === "column") {
      console.log("foo1")
      if(this.header === "hasHeaders") {
        console.log("foo2")
        cells = Object.keys(this).filter(prop => prop.startsWith("col_")).sort().map(prop => this[prop])
      } else {
        cells = this.myColumnData
      }
    } else {
      cells = this.mydata
      if(!Array.isArray(cells)) {
        cells = JSON.parse(cells)
      }
    }

    console.log(cells)

    // validate input
    if (!cells || !cells.length) {
      throw new Error("Please enter an array of elements in `Cells / Column Values`.")
    } else if (!Array.isArray(cells)) {
      throw new Error("Cell / Column data is not an array. Please enter an array of elements in `Cells / Column Values`.")
    } else if (Array.isArray(cells[0])) {
      throw new Error("Cell / Column data is a multi-dimensional array. A one-dimensional is expected. If you're trying to send multiple rows to Google Sheets, search for the action to add multiple rows to Sheets.")
    }

    return (await sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: this.sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [cells],
      },
    })).data.updates
  },
}