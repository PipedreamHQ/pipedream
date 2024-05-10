import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-get-values-in-range",
  name: "Get Values in Range",
  description: "Get all values or values from a range of cells using A1 notation. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)",
  version: "0.1.5",
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
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
      optional: true,
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: this.range
        ? `${this.worksheetId.label}!${this.range}`
        : `${this.worksheetId.label}`,
    })).data.values;
  },
};
