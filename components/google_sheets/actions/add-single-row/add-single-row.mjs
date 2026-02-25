import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";
import { isDynamicExpression } from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-add-single-row",
  name: "Add Single Row",
  description: "Add a single row of data to Google Sheets. Optionally insert the row at a specific index (e.g., row 2 to insert after headers, shifting existing data down). [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)",
  version: "2.2.1",
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
      content: "Note: Sheets that contain hidden or formatted rows may prevent the API from correctly identifying the last row of the sheet.",
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
      reloadProps: true,
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
        // If sheetId is a dynamic reference, don't load options
        if (isDynamicExpression(sheetId)) {
          return [];
        }

        // Otherwise, call the original options function with the correct context
        const origOptions = googleSheets.propDefinitions.worksheetIDs.options;
        return origOptions.call(this, {
          sheetId,
        });
      },
      reloadProps: true,
    },
    hasHeaders: common.props.hasHeaders,
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "The row number where the new row should be inserted (e.g., `2` to insert after the header row, shifting existing data down). If not specified, the row will be appended to the end of the sheet. **Note:** Row numbers start at 1. If your sheet has headers, use `2` or higher to avoid overwriting them.",
      optional: true,
      min: 1,
    },
  },
  async additionalProps() {
    const {
      sheetId,
      worksheetId,
      hasHeaders,
    } = this;

    // If using dynamic expressions for either sheetId or worksheetId, return only array input
    if (isDynamicExpression(sheetId) || isDynamicExpression(worksheetId)) {
      return {
        myColumnData: {
          type: "string[]",
          label: "Values",
          description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
        },
      };
    }

    const props = {};
    if (hasHeaders) {
      try {
        const worksheet = await this.getWorksheetById(sheetId, worksheetId);
        const { values } = await this.googleSheets.getSpreadsheetValues(sheetId, `${worksheet?.properties?.title}!1:1`);

        if (!values?.[0]?.length) {
          throw new ConfigurationError("Could not find a header row. Please either add headers and click \"Refresh fields\" or set 'Does the first row of the sheet have headers?' to false.");
        }

        for (let i = 0; i < values[0]?.length; i++) {
          props[`col_${i.toString().padStart(4, "0")}`] = {
            type: "string",
            label: values[0][i],
            optional: true,
          };
        }
        props.myColumnData = {
          type: "string[]",
          label: "Enter Values as Array",
          description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string. This field will overwrite the column input fields.",
          optional: true,
        };
      } catch (err) {
        console.error("Error fetching headers:", err);
        // Fallback to basic column input if headers can't be fetched
        return {
          headerError: {
            type: "string",
            label: "Header Fetch Error",
            description: `Unable to fetch headers: ${err.message}. Using simple column input instead.`,
            optional: true,
            hidden: true,
          },
          myColumnData: {
            type: "string[]",
            label: "Values",
            description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
          },
        };
      }
    } else {
      props.myColumnData = {
        type: "string[]",
        label: "Values",
        description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      sheetId,
      worksheetId,
      rowIndex,
      hasHeaders,
    } = this;

    // Validate rowIndex with respect to headers
    if (rowIndex && hasHeaders && rowIndex === 1) {
      throw new ConfigurationError("Cannot insert at row 1 when the sheet has headers. Please use row 2 or higher to avoid overwriting your header row.");
    }

    const { name: sheetName } = await this.googleSheets.getFile(sheetId, {
      fields: "name",
    });

    const worksheet = await this.getWorksheetById(sheetId, worksheetId);

    let cells;
    if (hasHeaders
      && !isDynamicExpression(sheetId)
      && !isDynamicExpression(worksheetId)
      && !this.myColumnData
    ) {
      const { values: rows } = await this.googleSheets.getSpreadsheetValues(sheetId, `${worksheet?.properties?.title}!1:1`);
      const [
        headers,
      ] = rows;
      cells = headers
        .map((_, i) => `col_${i.toString().padStart(4, "0")}`)
        .map((column) => this[column] ?? "");
    } else {
      // For dynamic references or no headers, use the array input
      cells = this.googleSheets.sanitizedArray(this.myColumnData);
    }

    // Validate input
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
      // Insert a blank row at the specified position
      await this.googleSheets.insertDimension(sheetId, {
        range: {
          sheetId: worksheetId,
          dimension: "ROWS",
          startIndex: rowIndex - 1, // API uses 0-based indexing
          endIndex: rowIndex, // endIndex is exclusive, so this inserts 1 row
        },
        inheritFromBefore: false,
      });

      // Update the newly inserted row with data
      data = await this.googleSheets.updateRow(
        sheetId,
        worksheet?.properties?.title,
        rowIndex,
        sanitizedCells,
      );
      updatedRange = `${worksheet?.properties?.title}!${rowIndex}:${rowIndex}`;
    } else {
      // Use the existing append behavior
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
