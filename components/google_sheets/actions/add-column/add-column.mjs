import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-add-column",
  name: "Create Column",
  description: "Create a new column in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the spreadsheet to edit. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
    column: {
      propDefinition: [
        googleSheets,
        "column",
      ],
      description: "Insert new column to the RIGHT of this column. Leave blank to insert at start of sheet",
      optional: true,
      default: "",
    },
  },
  methods: {
    async getColumnCount() {
      const sheets = (await this.googleSheets.getSpreadsheet(this.sheetId)).sheets
        .filter((s) => s.properties.sheetId == this.worksheetId);
      return sheets[0].properties.gridProperties.columnCount;
    },
  },
  async run() {
    const colIndex = this.googleSheets._getColumnIndex(this.column);
    const colCount = await this.getColumnCount();
    const requests = [];
    // if inserting a column outside of the grid limits, append to end
    if (colIndex >= colCount) {
      requests.push([
        {
          appendDimension: {
            sheetId: this.worksheetId,
            dimension: "COLUMNS",
            length: 1,
          },
        },
      ]);
    } else {
      requests.push([
        {
          insertRange: {
            range: {
              sheetId: this.worksheetId,
              startColumnIndex: colIndex,
              endColumnIndex: colIndex + 1,
            },
            shiftDimension: "COLUMNS",
          },
        },
      ]);
    }
    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests,
      },
    };
    return await this.googleSheets.batchUpdate(request);
  },
};
