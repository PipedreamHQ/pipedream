import googleSheets from "../../google_sheets.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";

export default {
  key: "google_sheets-update-row",
  name: "Update Row",
  description: "Update a row in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.1.4",
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
      withLabel: true,
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
        "cells",
      ],
    },
  },
  async run() {
    // validate input
    if (!this.cells || !this.cells.length) {
      throw new ConfigurationError("Please enter an array of elements in `Cells / Column Values`.");
    } console.log(this.cells);
    const cells = parseArray(this.cells); console.log(cells);
    if (!cells) {
      throw new ConfigurationError("Cell / Column data is not an array. Please enter an array of elements in `Cells / Column Values`.");
    }
    if (Array.isArray(cells[0])) {
      throw new ConfigurationError("Cell / Column data is a multi-dimensional array. A one-dimensional is expected.");
    }
    const request = {
      spreadsheetId: this.sheetId,
      range: `${this.worksheetId.label}!${this.row}:${this.row}`,
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
