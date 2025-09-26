import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";
import { isDynamicExpression } from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-update-row",
  name: "Update Row",
  description: "Update a row in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.1.15",
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
    row: {
      propDefinition: [
        googleSheets,
        "row",
      ],
      min: 1,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const {
      sheetId,
      worksheetId,
      row,
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

        const { values: rowValues } = (!isNaN(row) && row > 0)
          ? await this.googleSheets.getSpreadsheetValues(sheetId, `${worksheet?.properties?.title}!${row}:${row}`)
          : {};

        for (let i = 0; i < values[0]?.length; i++) {
          props[`col_${i.toString().padStart(4, "0")}`] = {
            type: "string",
            label: values[0][i],
            optional: true,
            default: rowValues?.[0]?.[i],
          };
        }
        props.allColumns = {
          type: "string",
          hidden: true,
          default: JSON.stringify(values),
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
  async run() {
    const {
      sheetId,
      worksheetId,
      row,
    } = this;

    let cells;
    if (this.hasHeaders
      && !isDynamicExpression(sheetId)
      && !isDynamicExpression(worksheetId)
      && this.allColumns
    ) {
      // Only use header-based processing if we have the allColumns prop and no dynamic expressions
      const rows = JSON.parse(this.allColumns);
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

    if (isNaN(row) || row < 1) {
      throw new ConfigurationError("Please enter a valid row number in `Row Number`.");
    }

    // validate input
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

    return await this.googleSheets.updateSpreadsheet(request);
  },
};
