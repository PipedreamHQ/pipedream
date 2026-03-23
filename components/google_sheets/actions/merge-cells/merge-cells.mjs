import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-merge-cells",
  name: "Merge Cells",
  description: "Merge a range of cells into a single cell. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#MergeCellsRequest)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleSheets,
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
          sheetId: c.sheetId,
        }),
      ],
    },
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
      description: "The range of cells to apply validation (e.g., `A1:A10`)",
    },
    mergeType: {
      type: "string",
      label: "Merge Type",
      description: "The type of merge to perform",
      options: [
        "MERGE_ALL",
        "MERGE_COLUMNS",
        "MERGE_ROWS",
      ],
      default: "MERGE_ALL",
    },
  },
  async run({ $ }) {
    const {
      startCol,
      endCol,
      startRow,
      endRow,
    } = this.googleSheets._parseRangeString(`${this.worksheetId}!${this.range}`);

    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            mergeCells: {
              range: {
                sheetId: this.worksheetId,
                startRowIndex: startRow,
                endRowIndex: endRow,
                startColumnIndex: this.googleSheets._getColumnIndex(startCol) - 1,
                endColumnIndex: this.googleSheets._getColumnIndex(endCol), // API end is exclusive
              },
              mergeType: this.mergeType,
            },
          },
        ],
      },
    };
    const response = await this.googleSheets.batchUpdate(request);
    $.export("$summary", "Successfully merged cells.");
    return response;
  },
};
