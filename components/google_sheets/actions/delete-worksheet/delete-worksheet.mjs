import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-delete-worksheet",
  name: "Delete Worksheet",
  description: "Delete a specific worksheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate)",
  version: "0.1.13",
  annotations: {
    destructiveHint: true,
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
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId: this.worksheetId,
            },
          },
        ],
      },
    };
    return await this.googleSheets.batchUpdate(request);
  },
};
