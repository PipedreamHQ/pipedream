const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-delete-row",
  name: "Delete Row",
  description: "Deletes a specific row in a spreadsheet",
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
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                "sheetId": this.worksheetId,
                "dimension": "ROWS",
                "startIndex": this.row - 1,
                "endIndex": this.row,
              },
            },
          },
        ],
      },
    };
    return await this.googleSheets.batchUpdate(request);
  },
};
