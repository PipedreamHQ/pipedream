import common from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-clear-cell",
  name: "Clear Cell",
  description: "Delete the content of a specific cell in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear)",
  version: "0.1.16",
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
    cell: {
      type: "string",
      label: "Cell",
      description: "The A1 notation of the cell to clear. E.g., `A1`",
    },
  },
  async run() {
    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const request = {
      spreadsheetId: this.sheetId,
      range: `${worksheet?.properties?.title}!${this.cell}`,
    };
    return await this.googleSheets.clearSheetValues(request);
  },
};
