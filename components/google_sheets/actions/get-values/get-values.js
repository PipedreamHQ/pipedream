const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-get-values",
  name: "Get Values",
  description: "Get all values from a sheet.",
  version: "0.0.14",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive to use. Enable structured mode to select a [shared drive](https://support.google.com/a/users/answer/9310351).",
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
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}`,
    })).data.values;
  },
};
