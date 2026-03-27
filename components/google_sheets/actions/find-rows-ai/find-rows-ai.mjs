// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";
import { rowsToObjects } from "../../common/ai-utils.mjs";

export default {
  key: "google_sheets-find-rows-ai",
  name: "Find Rows (AI)",
  description:
    "Search for rows matching a value in a specific column."
    + " Use **Get Spreadsheet Info** to discover column header"
    + " names."
    + " Returns matching rows as objects with row numbers (useful"
    + " for subsequent **Update Rows** calls)."
    + " For simple reads without filtering, use **Read Rows**"
    + " instead.",
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
    column: {
      type: "string",
      label: "Column",
      description:
        "Column header name (e.g., `Name`, `Email`) or column"
        + " letter (e.g., `A`, `B`).",
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "The value to search for.",
    },
    matchType: {
      type: "string",
      label: "Match Type",
      description:
        "How to match: `exact` (case-insensitive exact match),"
        + " `contains` (substring match), `starts_with`."
        + " Default: `contains`.",
      optional: true,
      options: [
        "exact",
        "contains",
        "starts_with",
      ],
      default: "contains",
    },
  },
  async run({ $ }) {
    const { values = [] } = await this.googleSheets
      .getSpreadsheetValues(
        this.spreadsheetId,
        `'${this.sheetName}'`,
      );

    if (!values.length) {
      $.export("$summary", "No data found in worksheet");
      return {
        matches: [],
        matchCount: 0,
      };
    }

    const headers = values[0];
    const dataRows = values.slice(1);

    // Resolve column index
    let colIndex = -1;
    const headerIndex = headers.findIndex(
      (h) => h?.toLowerCase() === this.column?.toLowerCase(),
    );
    if (headerIndex >= 0) {
      colIndex = headerIndex;
    } else if (/^[A-Z]+$/i.test(this.column)) {
      // Column letter to index (A=0, B=1, etc.)
      colIndex = this.column.toUpperCase()
        .split("")
        .reduce(
          (acc, c) => acc * 26 + c.charCodeAt(0) - 64, 0,
        ) - 1;
    }

    if (colIndex < 0) {
      throw new Error(
        `Column "${this.column}" not found. Available headers:`
        + ` ${headers.join(", ")}`,
      );
    }

    const matchType = this.matchType || "contains";
    const searchLower = this.searchValue.toLowerCase();

    const allRows = rowsToObjects(headers, dataRows);
    const matches = allRows.filter((row) => {
      const cellValue = String(
        dataRows[row._rowNumber - 2]?.[colIndex] || "",
      ).toLowerCase();

      switch (matchType) {
      case "exact":
        return cellValue === searchLower;
      case "starts_with":
        return cellValue.startsWith(searchLower);
      case "contains":
      default:
        return cellValue.includes(searchLower);
      }
    });

    $.export(
      "$summary",
      `Found ${matches.length} matching row${
        matches.length === 1
          ? ""
          : "s"}`,
    );

    return {
      matches,
      matchCount: matches.length,
    };
  },
};
