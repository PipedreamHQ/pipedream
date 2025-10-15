import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-insert-anchored-note",
  name: "Insert an Anchored Note",
  description: "Insert a note on a spreadsheet cell. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
    },
    sheetId: {
      propDefinition: [
        app,
        "sheetID",
        (c) => ({
          driveId: app.methods.getDriveId(c.drive),
        }),
      ],
    },
    cell: {
      propDefinition: [
        app,
        "cell",
      ],
    },
    content: {
      type: "string",
      label: "Comment",
      description: "The comment to add to the spreadsheet.",
    },
    worksheetId: {
      propDefinition: [
        app,
        "worksheetIDs",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      sheetId,
      content,
      worksheetId,
    } = this;

    const cell = this.cell.toUpperCase();
    if (cell.match(/(^[A-Z]+)|([0-9]+$)/gm).length != 2) {
      throw new ConfigurationError("Invalid cell reference");
    }

    const column = parseInt(this.app._getColumnIndex(cell.replace(/[0-9]/g, "")), 10);
    const row = parseInt(cell.replace(/[^0-9]/g, ""), 10);

    const request = {
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: {
                startRowIndex: row - 1,
                endRowIndex: row,
                startColumnIndex: column - 1,
                endColumnIndex: column,
              },
              rows: [
                {
                  values: [
                    {
                      note: content,
                    },
                  ],
                },
              ],
              fields: "note",
            },
          },
        ],
      },
    };

    if (worksheetId) {
      request.requestBody.requests[0].updateCells.range.sheetId = worksheetId;
    }

    const response = await this.app.batchUpdate(request);

    step.export("$summary", `Successfully added a note to the cell ${cell} of the spreadsheet with ID: "${this.sheetId}".`);

    return response;
  },
};
