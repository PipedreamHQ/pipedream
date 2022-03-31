import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-copy-worksheet",
  name: "Copy Worksheet",
  description: "Copy an existing worksheet to another Google Sheets file",
  version: "0.0.4",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the worksheet to copy. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
