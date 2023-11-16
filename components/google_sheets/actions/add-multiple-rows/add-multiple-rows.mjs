import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-add-multiple-rows",
  name: "Add Multiple Rows",
  description: "Add multiple rows of data to a Google Sheet",
  version: "0.2.2",
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
    rows: {
      propDefinition: [
        googleSheets,
        "rows",
      ],
    },
    resetRowFormat: {
      type: "boolean",
      label: "Reset Row Format",
      description: "Reset the formatting of the rows that were added (line style to none, background to white, foreground color to black, font size to 10, no bold, no italic, no strikethrough, horizontalAlignment to left). This is useful if you want to add rows to a formatted table in Google Sheets.",
      optional: true,
    },
  },
  async run() {
    let rows = this.rows;

    let inputValidated = true;

    if (!Array.isArray(rows)) {
      rows = JSON.parse(this.rows);
    }

    if (!rows || !rows.length || !Array.isArray(rows)) {
      inputValidated = false;
    } else {
      rows.forEach((row) => { if (!Array.isArray(row)) { inputValidated = false; } });
    }

    // Throw an error if input validation failed
    if (!inputValidated) {
      console.error("Data Submitted:");
      console.error(rows);
      throw new Error("Rows data is not an array of arrays. Please enter an array of arrays in the `Rows` parameter above. If you're trying to send a single rows to Google Sheets, search for the action to add a single row to Sheets or try modifying the code for this step.");
    }

    const addRowsResponse = await this.googleSheets.addRowsToSheet({
      spreadsheetId: this.sheetId,
      range: this.sheetName,
      rows,
    });

    if (this.resetRowFormat) {
      await this.googleSheets.resetRowFormat(this.sheetId, addRowsResponse.updatedRange);
    }
    return addRowsResponse;
  },
};
