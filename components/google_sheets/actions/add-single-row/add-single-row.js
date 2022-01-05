const googleSheets = require("../../google_sheets.app");

const dataEntry = { 
  type: "string",
  label: "Data Format",
  description: "You may enter individual values for each column or provide a single array representing the entire row.",
  options: [
    { label: "Enter a value for each column", value: "column" },
    { label: "Pass an array of values", value: "array" }
  ],
  reloadProps: true,
}

const headerProp = { 
  type: "string", 
  label: "Header Row?",
  description: "If the first row of your document has a header we'll retrieve it to make it easy to enter the value for each column.",
  options: [
    { label: "First row has headers", value: "hasHeaders" },
    { label: "There is no header row", value: "noHeaders" },
  ],
  reloadProps: true
}

module.exports = {
  key: "pravin-add-single-row",
  name: "Computed Props Test - Add Single Row",
  description: "Add a single row of data to Google Sheets",
  version: "1.0.0",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive"
      ],
      optional: true,
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
    dataEntry,
  },
  async additionalProps() {
    if (this.dataEntry == "column") {
      if(!this.header) {
        const rv = {}
        rv['header'] = headerProp
        return rv
      } else {
        if(this.header === "hasHeaders") {
          const rv = {}
          rv['header'] = headerProp
          const { values } = await this.googleSheets.getSpreadsheetValues(this.sheetId, `${this.sheetName}!1:1`)
          for (let i = 0; i < values[0].length; i++) {
            rv[`col_${i.toString().padStart(4, "0")}`] = { type: "string", label: values[0][i], optional: true }
          }
          return rv
        } else {
          const rv = {}
          rv['header'] = headerProp
          rv['myColumnData'] = { 
            type: "string[]", 
            label: "Row Data",
            description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string."
          }
          return rv
        }
      }
    } else {
      const rv = {}
      rv['arrayData'] = { 
        type: "any", 
        label: "Values",
        description: "Pass an array that represents a row of values. Each array element will be treated as a cell (e.g., entering `['Foo',1,2]` will insert a new row of data with values in 3 cells). The most common pattern is to reference an array exported by a previous step (e.g., `{{steps.foo.$return_value}}`). Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string."
      }
      return rv
    }
  },
  async run() {
    const sheets = this.googleSheets.sheets()
    let cells
    if(this.dataEntry === "column") {
      if(this.header === "hasHeaders") {
        cells = Object.keys(this).filter(prop => prop.startsWith("col_")).sort().map(prop => this[prop])
      } else {
        cells = this.myColumnData
      }
    } else {
      cells = this.arrayData
      if(!Array.isArray(cells)) {
        cells = JSON.parse(cells)
      }
    }

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