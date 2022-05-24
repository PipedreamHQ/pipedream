import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-clear-row",
  name: "Clear Row",
  description: "Delete the content of a row in a spreadsheet. Deleted rows will appear as blank rows.",
  version: "0.0.4",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the spreadsheet to edit. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
    row: {
      propDefinition: [
        googleSheets,
        "row",
      ],
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}!${this.row}:${this.row}`,
    };
    return await this.googleSheets.clearSheetValues(request);
  },
};
