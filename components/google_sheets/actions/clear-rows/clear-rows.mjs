import common from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-clear-rows",
  name: "Clear Rows",
  description: "Delete the content of a row or rows in a spreadsheet. Deleted rows will appear as blank rows. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear)",
  version: "0.1.15",
  annotations: {
    destructiveHint: true,
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
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "Row number of the start (inclusive) of the range of rows to clear",
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "Row number of the end (exclusive) of the range of rows to clear",
      optional: true,
    },
  },
  async run() {
    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const request = {
      spreadsheetId: this.sheetId,
      range: `${worksheet?.properties?.title}!${this.startIndex}:${this.endIndex || this.startIndex}`,
    };
    return await this.googleSheets.clearSheetValues(request);
  },
};
