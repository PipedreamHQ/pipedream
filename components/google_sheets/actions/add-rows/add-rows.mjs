// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";
import {
  getHeaders, parseRowInput,
} from "../../common/ai-utils.mjs";

export default {
  key: "google_sheets-add-rows",
  name: "Add Rows",
  description:
    "Append one or more rows to a Google Sheets worksheet."
    + " Pass rows as a JSON array."
    + " **Preferred format:** array of objects with column header"
    + " keys (e.g., `[{\"Name\": \"Alice\", \"Email\":"
    + " \"alice@example.com\"}]`)."
    + " Use **Get Spreadsheet Info** first to discover the exact"
    + " column header names — keys must match headers exactly"
    + " (case-sensitive)."
    + " Alternatively, pass rows as arrays of positional values"
    + " matching column order."
    + " New rows are appended after the last row with data.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    rows: {
      type: "string",
      label: "Rows",
      description:
        "JSON array of rows to append. Each row can be an object"
        + " with column header keys or an array of positional"
        + " values."
        + " Example (objects): `[{\"Name\": \"Alice\", \"Email\":"
        + " \"alice@example.com\"}, {\"Name\": \"Bob\","
        + " \"Email\": \"bob@example.com\"}]`."
        + " Example (arrays): `[[\"Alice\","
        + " \"alice@example.com\"], [\"Bob\","
        + " \"bob@example.com\"]]`.",
    },
    hasHeaders: {
      type: "boolean",
      label: "Has Headers",
      description:
        "Whether row 1 contains column headers. Required when"
        + " passing rows as objects. Default: `true`.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    let parsedRows;
    try {
      parsedRows = typeof this.rows === "string"
        ? JSON.parse(this.rows)
        : this.rows;
    } catch {
      throw new Error(
        "rows must be valid JSON. Example: [{\"Name\": \"Alice\"}]",
      );
    }

    if (!Array.isArray(parsedRows)) {
      parsedRows = [
        parsedRows,
      ];
    }

    let rowArrays;
    const needsHeaderMapping = parsedRows.some(
      (r) => !Array.isArray(r) && typeof r === "object",
    );

    if (needsHeaderMapping && this.hasHeaders !== false) {
      const headers = await getHeaders(
        this.googleSheets,
        this.spreadsheetId,
        this.sheetName,
      );
      if (!headers.length) {
        throw new Error(
          "No headers found in row 1. Either add headers or pass"
          + " rows as arrays.",
        );
      }
      rowArrays = parsedRows.map((row) => parseRowInput(headers, row));
    } else {
      rowArrays = parsedRows.map((row) => (
        Array.isArray(row)
          ? row
          : Object.values(row)
      ));
    }

    await this.googleSheets.addRowsToSheet({
      $,
      spreadsheetId: this.spreadsheetId,
      range: `'${this.sheetName}'`,
      rows: rowArrays,
      params: {
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
      },
    });

    $.export(
      "$summary",
      `Appended ${rowArrays.length} row${
        rowArrays.length === 1
          ? ""
          : "s"} to "${this.sheetName}"`,
    );

    return {
      rowsAdded: rowArrays.length,
    };
  },
};
