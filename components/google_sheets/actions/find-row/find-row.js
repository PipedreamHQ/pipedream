const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-find-row",
  name: "Find Row",
  description: "Find a row by a column and value",
  version: "0.0.1",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
    },
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    column: {
      propDefinition: [
        googleSheets,
        "column",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to search for",
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    const colValues = (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}!${this.column}:${this.column}`,
    })).data.values;
    const rowNumbers = [];
    return colValues.reduce((values, value, index) => {
      if (value == this.value) {
        rowNumbers.push(index + 1);
      }
      return rowNumbers;
    });
  },
};
