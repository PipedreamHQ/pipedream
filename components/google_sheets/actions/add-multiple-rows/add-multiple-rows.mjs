// x-pd-ai: optimized
import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-add-multiple-rows",
  name: "Add Multiple Rows",
  description: "Append multiple rows to a Google Sheet in one call. Provide `rows` as a JSON array of arrays — each inner array is one row, with cell values in column order (e.g. `[[\"Alice\",\"alice@ingen.test\",\"Engineering\"],[\"Bob\",\"bob@ingen.test\",\"Paleontology\"]]`). Use **Get Spreadsheet Info** first to see the column order. Rows are appended after the last row with data. To add a single row, or to insert at a specific position, use **Add Single Row** instead. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleSheets,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: Sheets that contain hidden or formatted rows or columns may prevent the API from correctly identifying the last row of the sheet.",
    },
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
  async run({ $ }) {
    let inputValidated = true;

    const rows = parseArray(this.rows);

    if (!rows) {
      inputValidated = false;
    } else {
      rows.forEach((row) => { if (!Array.isArray(row)) { inputValidated = false; } });
    }

    if (!inputValidated) {
      console.error("Data Submitted:");
      console.error(rows);
      throw new ConfigurationError("Rows data is not an array of arrays. Please enter an array of arrays in the `Rows` parameter above. If you're trying to send a single rows to Google Sheets, search for the action to add a single row to Sheets or try modifying the code for this step.");
    }

    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const addRowsResponse = await this.googleSheets.addRowsToSheet({
      spreadsheetId: this.sheetId,
      range: worksheet?.properties?.title,
      rows,
    });

    if (this.resetRowFormat) {
      await this.googleSheets.resetRowFormat(this.sheetId, addRowsResponse.updatedRange);
    }

    $.export("$summary", `Successfully added ${rows.length} row(s) to the spreadsheet.`);
    return addRowsResponse;
  },
};
