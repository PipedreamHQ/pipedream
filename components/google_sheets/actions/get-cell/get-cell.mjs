import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-get-cell",
  name: "Get Cell",
  description: "Fetch the contents of a specific cell in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)",
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
    cell: {
      propDefinition: [
        googleSheets,
        "cell",
      ],
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    const values = (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.worksheetId.label}!${this.cell}:${this.cell}`,
    })).data.values;
    if (values?.length) {
      return values[0][0];
    }
  },
};
