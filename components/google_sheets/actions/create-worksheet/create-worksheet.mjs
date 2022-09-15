import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-new-worksheet",
  name: "Create Worksheet",
  description: "Create a blank worksheet with a title",
  version: "0.0.5",
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new worksheet",
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: this.title,
              },
            },
          },
        ],
      },
    };
    return await this.googleSheets.batchUpdate(request);
  },
};
