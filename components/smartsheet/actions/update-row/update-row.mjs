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
  version: "0.1.0",
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
    const rows = JSON.parse(this.rows);
    const { byName } = await this.smartsheet.getColumnMap(this.sheetId);

    const apiRows = rows.map((row) => {
      const {
        rowId, ...fields
      } = row;
      const cells = [];
      for (const [
        name,
        value,
      ] of Object.entries(fields)) {
        const columnId = byName[name.toLowerCase()];
        if (columnId) {
          cells.push({
            columnId,
            value,
          });
        }
      }
      return {
        id: rowId,
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
