import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-copy-worksheet",
  name: "Copy Worksheet",
  description: "Copy an existing worksheet to another Google Sheets file. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.sheets/copyTo)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    },
    worksheetId: {
      propDefinition: [
        googleSheets,
        "worksheetIDs",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    destinationSheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The spreadsheet to copy the worksheet to",
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
