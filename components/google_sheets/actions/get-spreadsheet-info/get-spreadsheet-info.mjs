// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";
import { getHeaders } from "../../common/ai-utils.mjs";

export default {
  key: "google_sheets-get-spreadsheet-info",
  name: "Get Spreadsheet Info",
  description:
    "Get the structure of a Google Spreadsheet — worksheet"
    + " names, column headers (first row of each sheet), and"
    + " row counts."
    + " **Call this first** before reading or writing data, so"
    + " you know the worksheet names and column headers."
    + " The column headers are used as keys when writing data"
    + " with **Add Rows** or **Update Rows**."
    + " The spreadsheet ID is the long string in the Google"
    + " Sheets URL:"
    + " `https://docs.google.com/spreadsheets/d/{spreadsheetId}"
    + "/edit`.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleSheets,
    spreadsheetId: {
      type: "string",
      label: "Spreadsheet ID",
      description:
        "The spreadsheet ID from the Google Sheets URL.",
    },
  },
  async run({ $ }) {
    const spreadsheet = await this.googleSheets.getSpreadsheet(
      this.spreadsheetId,
      [
        "spreadsheetId",
        "properties.title",
        "sheets.properties",
      ],
    );

    const sheets = spreadsheet.sheets || [];
    const results = [];

    for (const sheet of sheets) {
      const name = sheet.properties?.title;
      const sheetId = sheet.properties?.sheetId;
      const rowCount = sheet.properties?.gridProperties?.rowCount;

      let headers = [];
      try {
        headers = await getHeaders(
          this.googleSheets,
          this.spreadsheetId,
          name,
        );
      } catch {
        // Sheet may be empty
      }

      results.push({
        sheetName: name,
        sheetId,
        rowCount,
        headers,
      });
    }

    const title = spreadsheet.properties?.title || this.spreadsheetId;

    $.export(
      "$summary",
      `Spreadsheet "${title}": ${results.length} worksheet${
        results.length === 1
          ? ""
          : "s"}`,
    );

    return {
      spreadsheetId: this.spreadsheetId,
      title,
      worksheets: results,
    };
  },
};
