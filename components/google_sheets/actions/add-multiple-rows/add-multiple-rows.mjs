import googleSheets from "../../google_sheets.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  parseArray, getWorksheetHeaders,
} from "../../common/utils.mjs";

export default {
  key: "google_sheets-add-multiple-rows",
  name: "Add Multiple Rows",
  description: "Add multiple rows of data to a Google Sheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)",
  version: "0.2.6",
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
    worksheetId: {
      propDefinition: [
        googleSheets,
        "worksheetIDs",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
      type: "string",
      label: "Worksheet Id",
      withLabel: true,
      reloadProps: true,
    },
    headersDisplay: {
      propDefinition: [
        googleSheets,
        "headersDisplay",
      ],
    },
    rows: {
      propDefinition: [
        googleSheets,
        "rows",
      ],
    },
    rowsDescription: {
      propDefinition: [
        googleSheets,
        "rowsDescription",
      ],
    },
    resetRowFormat: {
      type: "boolean",
      label: "Reset Row Format",
      description: "Reset the formatting of the rows that were added (line style to none, background to white, foreground color to black, font size to 10, no bold, no italic, no strikethrough, horizontalAlignment to left). This is useful if you want to add rows to a formatted table in Google Sheets.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.sheetId || !this.worksheetId) {
      return props;
    }
    const rowHeaders = await getWorksheetHeaders(this, this.sheetId, this.worksheetId.label);
    if (rowHeaders.length) {
      return {
        headersDisplay: {
          type: "alert",
          alertType: "info",
          content: `Possible Row Headers: **\`${rowHeaders.join(", ")}\`**`,
          hidden: false,
        },
      };
    }
  },
  async run() {
    let inputValidated = true;

    const rows = parseArray(this.rows);

    if (!rows) {
      inputValidated = false;
    } else {
      rows.forEach((row) => { if (!Array.isArray(row)) { inputValidated = false; } });
    }

    // Throw an error if input validation failed
    if (!inputValidated) {
      console.error("Data Submitted:");
      console.error(rows);
      throw new ConfigurationError("Rows data is not an array of arrays. Please enter an array of arrays in the `Rows` parameter above. If you're trying to send a single rows to Google Sheets, search for the action to add a single row to Sheets or try modifying the code for this step.");
    }

    const addRowsResponse = await this.googleSheets.addRowsToSheet({
      spreadsheetId: this.sheetId,
      range: this.worksheetId.label,
      rows,
    });

    if (this.resetRowFormat) {
      await this.googleSheets.resetRowFormat(this.sheetId, addRowsResponse.updatedRange);
    }
    return addRowsResponse;
  },
};
