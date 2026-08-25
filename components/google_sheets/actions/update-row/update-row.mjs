// x-pd-ai: optimized
import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";
import { isDynamicExpression } from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-update-row",
  name: "Update Row",
  description: "Overwrite cells in an existing row of a Google Sheet. Provide `row` (the 1-based row number — use **Find Rows** or **Read Rows** to get it from a row's `_rowNumber`) and `myColumnData`, a positional array of values starting at column A (e.g. `[\"Alice\",\"alice@ingen.test\",\"Engineering\"]`). Values are written left-to-right from column A, so include the current value of every column up to the one you're changing (read them first via **Get Spreadsheet Info** / **Read Rows**); columns after your last value are left unchanged, not cleared. To add a new row instead of overwriting one, use **Add Single Row**. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "1.0.0",
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
          sheetId: c.sheetId?.value || c.sheetId,
        }),
      ],
      description: "Select a worksheet or enter a custom expression. When referencing a spreadsheet dynamically, you must provide a custom expression for the worksheet.",
      async options({ sheetId }) {
        if (isDynamicExpression(sheetId)) {
          return [];
        }
        const origOptions = googleSheets.propDefinitions.worksheetIDs.options;
        return origOptions.call(this, {
          sheetId,
        });
      },
    },
    row: {
      propDefinition: [
        googleSheets,
        "row",
      ],
      min: 1,
    },
    myColumnData: {
      type: "string[]",
      label: "Values",
      description: "New values for each cell of the row, as an array or JSON-serialized array string (e.g. `[\"Alice\",\"31\",\"Senior Engineer\"]`). Accepts strings, numbers, and booleans; use an empty string for a blank cell.",
    },
  },
  async run({ $ }) {
    const {
      sheetId,
      worksheetId,
      row,
    } = this;

    // Parse a JSON-serialized array string before normalizing, so commas inside
    // quoted values are not split into separate cells.
    const parsedInput = parseArray(this.myColumnData);
    let cells = this.googleSheets.sanitizedArray(parsedInput === false
      ? this.myColumnData
      : parsedInput);

    if (isNaN(row) || row < 1) {
      throw new ConfigurationError("Please enter a valid row number in `Row Number`.");
    }

    if (!cells || !cells.length) {
      throw new ConfigurationError("Please enter an array of elements in `Row Values`.");
    }
    cells = parseArray(cells);
    if (!cells) {
      throw new ConfigurationError("Row Values is not an array. Please enter an array of elements in `Row Values`.");
    }
    if (Array.isArray(cells[0])) {
      throw new ConfigurationError("Row Values is a multi-dimensional array. A one-dimensional is expected.");
    }

    const worksheet = await this.getWorksheetById(sheetId, worksheetId);
    const request = {
      spreadsheetId: sheetId,
      range: `${worksheet?.properties?.title}!${row}:${row}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          cells,
        ],
      },
    };

    const response = await this.googleSheets.updateSpreadsheet(request);
    $.export("$summary", `Successfully updated row ${row} in the spreadsheet.`);
    return response;
  },
};
