import common from "../common/worksheet.mjs";
import {
  parseArray, getWorksheetHeaders,
} from "../../common/utils.mjs";
const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-update-multiple-rows",
  name: "Update Multiple Rows",
  description: "Update multiple rows in a spreadsheet defined by a range. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)",
  version: "0.1.13",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description:
        "The drive containing the worksheet to update. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
      reloadProps: true,
    },
    headersDisplay: {
      propDefinition: [
        googleSheets,
        "headersDisplay",
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
  async additionalProps() {
    const props = {};
    if (!this.sheetId || !this.worksheetId) {
      return props;
    }
    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const rowHeaders = await getWorksheetHeaders(this, this.sheetId, worksheet?.properties?.title);
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
      rows.forEach((row) => {
        if (!Array.isArray(row)) {
          inputValidated = false;
        }
      });
    }

    // Throw an error if input validation failed
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
    return await this.googleSheets.updateSpreadsheet(request);
  },
};
