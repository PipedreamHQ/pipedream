import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-add-single-row",
  name: "Add Single Row",
  description: "Add a single row of data to Google Sheets",
  version: "0.1.2",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "",
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
    cells: {
      propDefinition: [
        googleSheets,
        "cells",
      ],
    },
  },
  async run() {
    const cells = this.cells;

    // validate input
    if (!cells || !cells.length) {
      throw new Error("Please enter an array of elements in `Cells / Column Values`.");
    } else if (!Array.isArray(cells)) {
      throw new Error("Cell / Column data is not an array. Please enter an array of elements in `Cells / Column Values`.");
    } else if (Array.isArray(cells[0])) {
      throw new Error("Cell / Column data is a multi-dimensional array. A one-dimensional is expected. If you're trying to send multiple rows to Google Sheets, search for the action to add multiple rows to Sheets.");
    }

    return await this.googleSheets.addRowsToSheet({
      spreadsheetId: this.sheetId,
      range: this.sheetName,
      rows: [
        cells,
      ],
    });
  },
};
