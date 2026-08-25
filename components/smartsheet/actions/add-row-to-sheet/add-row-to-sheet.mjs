// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-row-to-sheet",
  name: "Add Row to Sheet",
  description:
    "Add one or more rows to a sheet, addressing cells by column NAME rather than column ID."
    + " Returns the created rows under `result`, each with its new row ID."
    + " Call **Get Sheet** or **List Columns** first to learn the column names."
    + " To change rows that already exist, use **Update Row**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/rows-addtosheet)",
  version: "1.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet to add rows to (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs.",
    },
    rows: {
      type: "string",
      label: "Rows",
      description:
        "JSON array of row objects mapping column names to values. For a single row, pass a one-element array."
        + " Example: `[{\"Species\": \"Triceratops\", \"Status\": \"Contained\"}]`."
        + " Column names must match the sheet exactly; call **Get Sheet** or **List Columns** to discover them.",
    },
    toTop: {
      type: "boolean",
      label: "Add to Top",
      description: "Set to `true` to add new rows to the top of the sheet. Defaults to bottom.",
      optional: true,
    },
  },
  async run({ $ }) {
    let parsedRows;
    try {
      parsedRows = JSON.parse(this.rows);
    } catch {
      throw new ConfigurationError("`Rows` must be a valid JSON array of objects.");
    }
    if (!Array.isArray(parsedRows) || !parsedRows.length) {
      throw new ConfigurationError("`Rows` must be a non-empty JSON array.");
    }

    const { byName } = await this.smartsheet.getColumnMap(this.sheetId, {
      $,
    });

    const apiRows = parsedRows.map((row, rowIndex) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        throw new ConfigurationError(`Row at index ${rowIndex} must be an object of column name/value pairs.`);
      }
      const entries = Object.entries(row);
      if (!entries.length) {
        throw new ConfigurationError(`Row at index ${rowIndex} is empty.`);
      }
      const cells = [];
      const unknownColumns = [];
      for (const [
        name,
        value,
      ] of entries) {
        const columnId = byName[name.toLowerCase()];
        if (columnId) {
          cells.push({
            columnId,
            value,
          });
        } else {
          unknownColumns.push(name);
        }
      }
      if (unknownColumns.length) {
        throw new ConfigurationError(`Row at index ${rowIndex} references unknown column(s): ${unknownColumns.join(", ")}. Use **Get Sheet** or **List Columns** to see valid column names.`);
      }
      const rowObj = {
        cells,
      };
      if (this.toTop) {
        rowObj.toTop = true;
      } else {
        rowObj.toBottom = true;
      }
      return rowObj;
    });

    const response = await this.smartsheet.addRow(this.sheetId, {
      $,
      data: apiRows,
    });

    const count = response.result?.length || 1;
    $.export("$summary", `Added ${count} row(s) to sheet ${this.sheetId}`);
    return response;
  },
};
