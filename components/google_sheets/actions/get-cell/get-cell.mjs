import common from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-get-cell",
  name: "Get Cell",
  description: "Fetch the contents of a specific cell in a spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)",
  version: "0.1.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    cell: {
      propDefinition: [
        googleSheets,
        "cell",
      ],
    },
  },
  async run() {
    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const sheets = this.googleSheets.sheets();

    const values = (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${worksheet?.properties?.title}!${this.cell}:${this.cell}`,
    })).data.values;
    if (values?.length) {
      return values[0][0];
    }
  },
};
