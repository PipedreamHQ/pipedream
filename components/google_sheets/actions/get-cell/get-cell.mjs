import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-get-cell",
  name: "Get Cell",
  description: "Fetch the contents of a specific cell in a spreadsheet",
  version: "0.0.5",
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
