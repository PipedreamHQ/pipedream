const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-clear-row",
  name: "Clear Row",
  description: "Delete the content of a row in a spreadsheet. Deleted rows will appear as blank rows.",
  version: "0.0.1",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the spreadsheet to edit",
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
