import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-update-cell",
  name: "Update Cell",
  description: "Update a cell in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.1.5",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the worksheet to update. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The spreadsheet containing the worksheet to update",
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
      label: "Cell",
    },
    newCell: {
      propDefinition: [
        googleSheets,
        "cell",
      ],
      label: "Cell Value",
      description: "The new cell value",
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      range: `${this.worksheetId.label}!${this.cell}:${this.cell}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            this.newCell,
          ],
        ],
      },
    };
    return await this.googleSheets.updateSpreadsheet(request);
  },
};
