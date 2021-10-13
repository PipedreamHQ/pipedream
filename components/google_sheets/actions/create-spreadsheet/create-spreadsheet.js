const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-create-spreadsheet",
  name: "Create Spreadsheet",
  description: "Create a blank spreadsheet or duplicate an existing spreadsheet",
  version: "0.0.1",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive to create the new spreadsheet in",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new spreadsheet",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The Google spreadsheet to copy",
      optional: true,
    },
  },
  async run() {
    if (this.sheetId) {
      return await this.googleSheets.copySpreadsheet(this.sheetId, this.title);
    }
    const request = {
      resource: {
        properties: {
          title: this.title,
        },
      },
    };
    return await this.googleSheets.createSpreadsheet(request);
  },
};
