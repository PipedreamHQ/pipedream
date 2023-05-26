import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-get-spreadsheet-by-id",
  name: "Get Spreadsheet by ID",
  description: "Returns the spreadsheet at the given ID. [See the docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get) for more information",
  version: "0.1.1",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const spreadsheet = await this.googleSheets.getSpreadsheet(this.sheetId);
    $.export("$summary", `Successfully found spreadsheet with ID: "${this.sheetId}"`);
    return spreadsheet;
  },
};
