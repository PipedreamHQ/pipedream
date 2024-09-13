import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-update-row",
  name: "Update Row",
  description: "Update a row in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.1.8",
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
      type: "string",
      label: "Worksheet Id",
    },
    row: {
      propDefinition: [
        googleSheets,
        "row",
      ],
    },
    hasHeaders: {
      type: "boolean",
      label: "Does the first row of the sheet have headers?",
      description: "If the first row of your document has headers, we'll retrieve them to make it easy to enter the value for each column. Please note, that if you are referencing a worksheet using a custom expression referencing data from another step, e.g. `{{steps.my_step.$return_value}}` this prop cannot be used. If you want to retrieve the header row, select both **Spreadsheet** and **Worksheet ID** from the dropdowns above.",
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

    const props = {};
    if (hasHeaders && row) {
      const worksheet = await this.getWorksheetById(sheetId, worksheetId);

      const { values } = await this.googleSheets.getSpreadsheetValues(sheetId, `${worksheet?.properties?.title}!1:1`);
      if (!values[0]?.length) {
        throw new ConfigurationError("Could not find a header row. Please either add headers and click \"Refresh fields\" or adjust the action configuration to continue.");
      }
      const { values: rowValues } = !isNaN(row)
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
    }
    if (hasHeaders === false) {
      props.myColumnData = {
        type: "string[]",
        label: "Values",
        description: "Provide a value for each cell of the row. Google Sheets accepts strings, numbers and boolean values for each cell. To set a cell to an empty value, pass an empty string.",
      };
    }
    return props;
  },
  async run() {
    let cells;
    if (this.hasHeaders) {
      const rows = JSON.parse(this.allColumns);
      const [
        headers,
      ] = rows;
      cells = headers
        .map((_, i) => `col_${i.toString().padStart(4, "0")}`)
        .map((column) => this[column] ?? "");
    } else {
      cells = this.googleSheets.sanitizedArray(this.myColumnData);
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
    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const request = {
      spreadsheetId: this.sheetId,
      range: `${worksheet?.properties?.title}!${this.row}:${this.row}`,
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
