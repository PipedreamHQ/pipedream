const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-copy-worksheet",
  name: "Copy Worksheet",
  description: "Copy an existing worksheet to another Google Sheets file",
  version: "0.0.2",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the worksheet to copy. Enable structured mode to select a [shared drive](https://support.google.com/a/users/answer/9310351).",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The spreadsheet containing the worksheet to copy",
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
      label: "Worksheet",
      description: "The worksheet to copy",
    },
    destinationSheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The spreadsheet to copy the worksheetsheet to",
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      sheetId: this.worksheetId,
      resource: {
        destinationSpreadsheetId: this.destinationSheetId,
      },
    };
    return await this.googleSheets.copyWorksheet(request);
  },
};
