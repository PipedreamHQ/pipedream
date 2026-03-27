// vandelay-test-dr
import googleSheets from "../../google_sheets.app.mjs";
import {
  getHeaders, rowObjectToArray,
} from "../../common/ai-utils.mjs";

export default {
  key: "google_sheets-update-rows",
  name: "Update Rows",
  description:
    "Update specific rows in a Google Sheets worksheet."
    + " Pass an array of updates, each with a `row` number and"
    + " `values`."
    + " Example: `[{\"row\": 3, \"values\": {\"Status\":"
    + " \"Complete\", \"Score\": 95}}]`."
    + " Use **Find Rows** or **Read Rows** to discover row"
    + " numbers first."
    + " Use **Get Spreadsheet Info** to discover column header"
    + " names."
    + " Only specified columns are updated when using object"
    + " values — unspecified columns are left unchanged.",
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
    updates: {
      type: "string",
      label: "Updates",
      description:
        "JSON array of update objects. Each object has `row`"
        + " (1-indexed row number) and `values` (object with"
        + " header keys or array of positional values)."
        + " Example: `[{\"row\": 3, \"values\": {\"Status\":"
        + " \"Complete\"}}]`.",
    },
    hasHeaders: {
      type: "boolean",
      label: "Has Headers",
      description:
        "Whether row 1 contains column headers. Default: `true`.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    let parsedUpdates;
    try {
      parsedUpdates = typeof this.updates === "string"
        ? JSON.parse(this.updates)
        : this.updates;
    } catch {
      throw new Error(
        "updates must be valid JSON. Example:"
        + " [{\"row\": 3, \"values\": {\"Status\": \"Done\"}}]",
      );
    }

    if (!Array.isArray(parsedUpdates)) {
      parsedUpdates = [
        parsedUpdates,
      ];
    }

    let headers = [];
    const needsHeaders = parsedUpdates.some(
      (u) => u.values && !Array.isArray(u.values)
        && typeof u.values === "object",
    );

    if (needsHeaders && this.hasHeaders !== false) {
      headers = await getHeaders(
        this.googleSheets,
        this.spreadsheetId,
        this.sheetName,
      );
    }

    for (const update of parsedUpdates) {
      if (!update.row) {
        throw new Error(
          "Each update must have a `row` number.",
        );
      }

      const { values } = update;
      const rowNum = update.row;

      if (Array.isArray(values)) {
        // Positional update — overwrite the entire row
        await this.googleSheets.updateRow(
          this.spreadsheetId,
          this.sheetName,
          rowNum,
          values.map((v) => (v !== undefined && v !== null
            ? String(v)
            : "")),
        );
      } else if (typeof values === "object" && values !== null) {
        if (!headers.length) {
          throw new Error(
            "Headers required to map object keys to columns."
            + " Ensure row 1 has headers.",
          );
        }
        // Partial update — only specified columns
        const fullRow = rowObjectToArray(headers, values);
        // Find which columns were specified
        const cellUpdates = {};
        headers.forEach((header, i) => {
          if (values[header] !== undefined) {
            cellUpdates[i] = String(values[header]);
          }
        });

        if (Object.keys(cellUpdates).length === headers.length) {
          await this.googleSheets.updateRow(
            this.spreadsheetId,
            this.sheetName,
            rowNum,
            fullRow,
          );
        } else {
          // Use cell-level updates for partial row changes
          await this.googleSheets.updateRowCells(
            this.spreadsheetId,
            this.sheetName,
            rowNum,
            cellUpdates,
          );
        }
      }
    }

    $.export(
      "$summary",
      `Updated ${parsedUpdates.length} row${
        parsedUpdates.length === 1
          ? ""
          : "s"} in "${this.sheetName}"`,
    );

    return {
      rowsUpdated: parsedUpdates.length,
    };
  },
};
