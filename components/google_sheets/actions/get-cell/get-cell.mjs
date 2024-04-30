import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-get-cell",
  name: "Get Cell",
  description: "Fetch the contents of a specific cell in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)",
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
    cell: {
      propDefinition: [
        googleSheets,
        "cell",
      ],
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}!${this.cell}:${this.cell}`,
    })).data.values;
  },
};
