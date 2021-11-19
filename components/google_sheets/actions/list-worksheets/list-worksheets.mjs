import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-list-worksheets",
  name: "List Worksheets",
  description: "Get a list of all worksheets in a spreadsheet",
  version: "0.0.2",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive to select a spreadsheet from",
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
