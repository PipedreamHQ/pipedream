import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-list-worksheets",
  name: "List Worksheets",
  description: "Get a list of all worksheets in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get)",
  version: "0.1.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive to select a spreadsheet from. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "List worksheets in the specified spreadsheet",
    },
  },
  async run() {
    const { sheets } = await this.googleSheets.getSpreadsheet(this.sheetId);
    return sheets;
  },
};
