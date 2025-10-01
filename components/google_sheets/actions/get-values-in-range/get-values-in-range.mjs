import common from "../common/worksheet.mjs";

const { googleSheets } = common.props;

export default {
  ...common,
  key: "google_sheets-get-values-in-range",
  name: "Get Values in Range",
  description: "Get all values or values from a range of cells using A1 notation. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)",
  version: "0.1.14",
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
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
      optional: true,
    },
  },
  async run() {
    const worksheet = await this.getWorksheetById(this.sheetId, this.worksheetId);
    const sheets = this.googleSheets.sheets();

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: this.range
        ? `${worksheet?.properties?.title}!${this.range}`
        : `${worksheet?.properties?.title}`,
    })).data.values;
  },
};
