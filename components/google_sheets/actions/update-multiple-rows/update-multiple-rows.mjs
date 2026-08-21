// x-pd-ai: optimized
import common from "../common/worksheet.mjs";
import { parseArray } from "../../common/utils.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-update-multiple-rows",
  name: "Update Multiple Rows",
  description: "Overwrite a contiguous block of cells in a Google Sheet, defined by an A1 range. Provide `range` WITHOUT the worksheet name — just the cells, e.g. `A2:C3` (the tool prepends the worksheet automatically; passing `Sheet1!A2:C3` will fail). Provide `rows` as a JSON array of arrays matching the range, each inner array a row in column order (e.g. range `A2:C3` with `[[\"Alice\",\"alice@ingen.test\",\"Active\"],[\"Bob\",\"bob@ingen.test\",\"Active\"]]`). Use **Read Rows** to see current values and **Get Spreadsheet Info** for the column order. This overwrites the range in place; to insert rows and shift others down, use **Add Single Row**. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the worksheet to update. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
    worksheetId: {
      propDefinition: [
        googleSheets,
        "worksheetIDs",
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
    rowsDescription: {
      propDefinition: [
        googleSheets,
        "rowsDescription",
      ],
    },
  },
  async run({ $ }) {
    let inputValidated = true;

    const rows = parseArray(this.rows);

    if (!rows) {
      inputValidated = false;
    } else {
      rows.forEach((row) => {
        if (!Array.isArray(row)) {
          inputValidated = false;
        }
      });
    }

    if (!inputValidated) {
      console.error("Data Submitted:");
      console.error(rows);
      throw new Error(
        "Rows data is not an array of arrays. Please enter an array of arrays in the `Rows` parameter above. If you're trying to send a single rows to Google Sheets, search for the action to add a single row to Sheets or try modifying the code for this step.",
      );
    }

    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const request = {
      spreadsheetId: this.sheetId,
      range: `${worksheet?.properties?.title}!${this.range}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: rows,
      },
    };
    const response = await this.googleSheets.updateSpreadsheet(request);
    $.export("$summary", `Successfully updated ${rows.length} row(s) in the spreadsheet.`);
    return response;
  },
};
