import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-update-rows",
  name: "Update Rows",
  description: "Update multiple rows in a spreadsheet defined by a range",
  version: "0.0.2",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description:
        "The drive containing the worksheet to update. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The spreadsheet containing the worksheet to update",
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
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
    },
    rows: {
      propDefinition: [
        googleSheets,
        "rows",
      ],
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
      rows.forEach((row) => {
        if (!Array.isArray(row)) {
          inputValidated = false;
        }
      });
    }

    // Throw an error if input validation failed
    if (!inputValidated) {
      console.error("Data Submitted:");
      console.error(rows);
      throw new Error(
        "Rows data is not an array of arrays. Please enter an array of arrays in the `Rows` parameter above. If you're trying to send a single rows to Google Sheets, search for the action to add a single row to Sheets or try modifying the code for this step.",
      );
    }

    const request = {
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}!${this.range}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: rows,
      },
    };
    return await this.googleSheets.updateSpreadsheet(request);
  },
};
