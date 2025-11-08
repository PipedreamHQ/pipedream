import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-merge-cells",
  name: "Merge Cells",
  description: "Merge a range of cells into a single cell. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#MergeCellsRequest)",
  version: "0.0.1",
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
  async run() {
    const {
      startCol,
      endCol,
      startRow,
      endRow,
    } = this.props.googleSheets._parseRangeString(`${this.props.worksheetId}!${this.props.range}`);

    const request = {
      spreadsheetId: this.props.sheetId,
      requestBody: {
        requests: [
          {
            mergeCellsRequest: {
              range: {
                sheetId: this.props.worksheetId,
                startRowIndex: startRow,
                endRowIndex: endRow,
                startColumnIndex: startCol.charCodeAt(0) - 65,
                endColumnIndex: endCol.charCodeAt(0) - 64,
              },
              mergeType: this.props.mergeType,
            },
          },
        ],
      },
    };
    return await this.props.googleSheets.batchUpdate(request);
  },
};
