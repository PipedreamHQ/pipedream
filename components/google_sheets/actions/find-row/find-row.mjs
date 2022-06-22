import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-find-row",
  name: "Find Row",
  description: "Find one or more rows by a column and value",
  version: "0.1.3",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
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

    const rows = [];
    return colValues.reduce((values, value, index) => {
      if (value == this.value) {
        rows.push({
          value,
          index,
          googleSheetsRowNumber: index + 1,
        });
      }
      return rows;
    });
  },
};
