import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-delete-rows",
  name: "Delete Rows",
  description: "Deletes the specified rows from a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#deletedimensionrequest)",
  version: "0.0.1",
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
      label: "Worksheet",
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "Row number of the start (inclusive) of the range of rows to delete",
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "Row number of the end (exclusive) of the range of rows to delete",
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
                "startIndex": this.startIndex - 1,
                "endIndex": this.endIndex - 1,
              },
            },
          },
        ],
      },
    };
    return this.googleSheets.batchUpdate(request);
  },
};
