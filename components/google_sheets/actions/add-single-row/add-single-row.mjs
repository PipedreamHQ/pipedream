// x-pd-ai: optimized
import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";
import { isDynamicExpression } from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-add-single-row",
  name: "Add Single Row",
  description: "Add a single row to a Google Sheet. By default the row is appended to the end. To INSERT the row at a specific position instead — pushing the rows at and below that position DOWN without overwriting them — set Row Index (e.g. Row Index 2 inserts directly below a header row). Use this tool (not Update Row or Update Multiple Rows) whenever the goal is to insert a row between existing rows or add a row while keeping every current row: the Update tools overwrite cells in place and do NOT shift rows down. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)",
  version: "3.0.0",
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
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "The row number where the new row should be inserted (e.g., `2` to insert after the header row, shifting existing data down). If not specified, the row will be appended to the end of the sheet. **Note:** Row numbers start at 1.",
      optional: true,
      min: 1,
    },
    myColumnData: {
      type: "string[]",
      label: "Values",
      description: "Values for each cell of the row, as an array or JSON-serialized array string (e.g. `[\"Alice\",\"30\",\"Engineer\"]`). Accepts strings, numbers, and booleans; use an empty string for a blank cell.",
    },
  },
  async run({ $ }) {
    const {
      sheetId,
      worksheetId,
      rowIndex,
    } = this;

    const { name: sheetName } = await this.googleSheets.getFile(sheetId, {
      fields: "name",
    });

    const worksheet = await this.getWorksheetById(sheetId, worksheetId);

    let cells = this.googleSheets.sanitizedArray(this.myColumnData);

    if (!cells || !cells.length) {
      throw new ConfigurationError("Please enter an array of elements in `Cells / Column Values`.");
    }
    cells = parseArray(cells);
    if (!cells) {
      throw new ConfigurationError("Cell / Column data is not an array. Please enter an array of elements in `Cells / Column Values`.");
    } else if (Array.isArray(cells[0])) {
      throw new ConfigurationError("Cell / Column data is a multi-dimensional array. A one-dimensional is expected. If you're trying to send multiple rows to Google Sheets, search for the action to add multiple rows to Sheets.");
    }

    const {
      arr: sanitizedCells,
      convertedIndexes,
    } = this.googleSheets.arrayValuesToString(cells);

    let data;
    let updatedRange;

    if (rowIndex) {
      await this.googleSheets.insertDimension(sheetId, {
        range: {
          sheetId: worksheetId,
          dimension: "ROWS",
          startIndex: rowIndex - 1,
          endIndex: rowIndex,
        },
        inheritFromBefore: false,
      });

      data = await this.googleSheets.updateRow(
        sheetId,
        worksheet?.properties?.title,
        rowIndex,
        sanitizedCells,
      );
      updatedRange = `${worksheet?.properties?.title}!${rowIndex}:${rowIndex}`;
    } else {
      data = await this.googleSheets.addRowsToSheet({
        spreadsheetId: sheetId,
        range: worksheet?.properties?.title,
        rows: [
          sanitizedCells,
        ],
      });
      updatedRange = data.updatedRange;
    }

    let summary = rowIndex
      ? `Inserted 1 row at position ${rowIndex} in [${sheetName || sheetId} (${updatedRange})](https://docs.google.com/spreadsheets/d/${sheetId}).`
      : `Added 1 row to [${sheetName || sheetId} (${updatedRange})](https://docs.google.com/spreadsheets/d/${sheetId}).`;

    if (convertedIndexes.length > 0) {
      summary += " We detected something other than a string/number/boolean in at least one of the fields and automatically converted it to a string.";
    }
    $.export("$summary", summary);

    return data;
  },
};
