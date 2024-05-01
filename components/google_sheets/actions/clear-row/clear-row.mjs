import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-clear-row",
  name: "Clear Row",
  description: "Delete the content of a row in a spreadsheet. Deleted rows will appear as blank rows. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear)",
  version: "0.1.3",
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
      range: `${this.worksheetId.label}!${this.row}:${this.row}`,
    };
    return await this.googleSheets.clearSheetValues(request);
  },
};
