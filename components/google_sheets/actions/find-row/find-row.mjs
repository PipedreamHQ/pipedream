import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-find-row",
  name: "Find Row",
  description: "Find one or more rows by a column and value. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)",
  version: "0.2.5",
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
    worksheetId: {
      propDefinition: [
        googleSheets,
        "worksheetIDs",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
      type: "string",
      label: "Worksheet Id",
      withLabel: true,
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
    exportRow: {
      type: "boolean",
      label: "Export Row",
      description: "Set to `true` to return cell values for the entire row",
      optional: true,
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    const colValues = (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.worksheetId.label}!${this.column}:${this.column}`,
    })).data.values;

    const rows = [];
    const result = colValues.reduce((values, value, index) => {
      if (value == this.value) {
        rows.push({
          value,
          index,
          googleSheetsRowNumber: index + 1,
        });
      }
      return rows;
    });

    if (!this.exportRow) {
      return result;
    }

    const indexes = result.map(({ index }) => index);
    const { data: { values } } =
      await sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `${this.worksheetId.label}`,
      });
    return values.reduce((acc, row, index) => {
      if (indexes.includes(index)) {
        return acc.concat({
          row,
          index,
          googleSheetsRowNumber: index + 1,
        });
      }
      return acc;
    }, []);
  },
};
