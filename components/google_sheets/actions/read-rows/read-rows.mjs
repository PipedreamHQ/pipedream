// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";
import { rowsToObjects } from "../../common/ai-utils.mjs";

export default {
  key: "google_sheets-read-rows",
  name: "Read Rows",
  description:
    "Read rows from a Google Sheets worksheet."
    + " Returns data as objects (keys = column headers from"
    + " row 1) by default, or as raw arrays."
    + " Use **Get Spreadsheet Info** first to discover worksheet"
    + " names."
    + " Optionally specify a range in A1 notation (e.g.,"
    + " `A2:D10`) to read a subset."
    + " For searching rows by value, use **Find Rows** instead.",
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
    sheetName: {
      type: "string",
      label: "Worksheet Name",
      description:
        "The worksheet (tab) name. Use **Get Spreadsheet Info**"
        + " to discover worksheet names.",
    },
    range: {
      type: "string",
      label: "Range",
      description:
        "Optional A1 notation range within the sheet (e.g.,"
        + " `A1:D10`, `A:F`). Omit to read all data.",
      optional: true,
    },
    hasHeaders: {
      type: "boolean",
      label: "Has Headers",
      description:
        "Whether row 1 contains column headers. If true,"
        + " returns rows as objects with header keys. Default:"
        + " `true`.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const fullRange = this.range
      ? `'${this.sheetName}'!${this.range}`
      : `'${this.sheetName}'`;

    const { values = [] } = await this.googleSheets
      .getSpreadsheetValues(
        this.spreadsheetId,
        fullRange,
      );

    if (!values.length) {
      $.export("$summary", "No data found");
      return {
        rows: [],
        rowCount: 0,
      };
    }

    if (this.hasHeaders !== false && values.length > 0) {
      const headers = values[0];
      const dataRows = values.slice(1);
      const rows = rowsToObjects(headers, dataRows);

      $.export(
        "$summary",
        `Read ${rows.length} row${rows.length === 1
          ? ""
          : "s"} from "${this.sheetName}"`,
      );

      return {
        headers,
        rows,
        rowCount: rows.length,
      };
    }

    $.export(
      "$summary",
      `Read ${values.length} row${values.length === 1
        ? ""
        : "s"} from "${this.sheetName}"`,
    );

    return {
      rows: values,
      rowCount: values.length,
    };
  },
};
