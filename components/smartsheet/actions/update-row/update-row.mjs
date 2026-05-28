import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-row",
  name: "Update Row",
  description:
    "Update one or more rows in a sheet by row ID. Accepts column NAMES as keys — resolves to column IDs internally."
    + " Call **Get Sheet** or **List Columns** to find row IDs and column names."
    + " Each object needs a `rowId` plus column name/value pairs:"
    + " `[{\"rowId\": 123456, \"Status\": \"Done\", \"Priority\": \"High\"}]`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/update-rows)",
  version: "1.0.0",
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
      description: "The ID of the sheet containing the rows. Use **List Sheets** to find sheet IDs.",
    },
    rows: {
      type: "string",
      label: "Rows",
      description:
        "JSON array of row update objects. Each needs `rowId` plus column name/value pairs."
        + " Example: `[{\"rowId\": 123456, \"Status\": \"Done\", \"Priority\": \"High\"}]`."
        + " Call **Get Sheet** to find row IDs and column names.",
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
        throw new ConfigurationError(`Row at index ${rowIndex} must be an object with a rowId and column name/value pairs.`);
      }
      const {
        rowId, ...fields
      } = row;
      const numericRowId = Number(rowId);
      if (!rowId || Number.isNaN(numericRowId)) {
        throw new ConfigurationError(`Row at index ${rowIndex} is missing a valid \`rowId\`.`);
      }
      const entries = Object.entries(fields);
      if (!entries.length) {
        throw new ConfigurationError(`Row at index ${rowIndex} has no column updates.`);
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
      return {
        id: numericRowId,
        cells,
      };
    });

    const response = await this.smartsheet.updateRow(this.sheetId, {
      $,
      data: apiRows,
    });

    const count = response.result?.length || 1;
    $.export("$summary", `Updated ${count} row(s) in sheet ${this.sheetId}`);
    return response;
  },
};
