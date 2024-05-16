import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-clear-cell",
  name: "Clear Cell",
  description: "Delete the content of a specific cell in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear)",
  version: "0.1.7",
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
    cell: {
      type: "string",
      label: "Cell",
      description: "The A1 notation of the cell to clear. E.g., `A1`",
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      range: `${this.worksheetId.label}!${this.cell}`,
    };
    return await this.googleSheets.clearSheetValues(request);
  },
};
