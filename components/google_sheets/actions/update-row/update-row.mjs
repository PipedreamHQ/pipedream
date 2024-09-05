import common from "../common/worksheet.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-update-row",
  name: "Update Row",
  description: "Update a row in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.1.7",
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
    cells: {
      propDefinition: [
        googleSheets,
        "rows",
      ],
      description: "Enter an array, with each element of the array representing a cell/column value (e.g. `[\"Foo\",1,2]`). You may reference an arrays exported by a previous step (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will JSON.parse() to an array.",
    },
  },
  async run() {
    // validate input
    if (!this.cells || !this.cells.length) {
      throw new ConfigurationError("Please enter an array of elements in `Row Values`.");
    }
    const cells = parseArray(this.cells);
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
