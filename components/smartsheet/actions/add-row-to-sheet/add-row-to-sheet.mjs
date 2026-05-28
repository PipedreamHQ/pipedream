import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-row-to-sheet",
  name: "Add Row to Sheet",
  description:
    "Add one or more rows to a sheet. Accepts column NAMES as keys — resolves to column IDs internally."
    + " Call **Get Sheet** or **List Columns** first to learn column names."
    + " Pass rows as a JSON array of objects mapping column names to values:"
    + " `[{\"Task\": \"Review doc\", \"Status\": \"Open\"}]`."
    + " For a single row, pass a one-element array."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/rows-addtosheet)",
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
      description: "The ID of the sheet to add rows to. Use **List Sheets** to find sheet IDs.",
    },
    rows: {
      type: "string",
      label: "Rows",
      description:
        "JSON array of row objects mapping column names to values."
        + " Example: `[{\"Species\": \"Triceratops\", \"Status\": \"Contained\"}]`."
        + " Call **Get Sheet** or **List Columns** to discover column names.",
    },
    toTop: {
      type: "boolean",
      label: "Add to Top",
      description: "Set to `true` to add new rows to the top of the sheet. Defaults to bottom.",
      optional: true,
    },
  },
  async run({ $ }) {
    const rows = JSON.parse(this.rows);
    const { byName } = await this.smartsheet.getColumnMap(this.sheetId);

    const apiRows = rows.map((row) => {
      const cells = [];
      for (const [
        name,
        value,
      ] of Object.entries(row)) {
        const columnId = byName[name.toLowerCase()];
        if (columnId) {
          cells.push({
            columnId,
            value,
          });
        }
      }
      const rowObj = {
        cells,
      };
      if (this.toTop) rowObj.toTop = true;
      else rowObj.toBottom = true;
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
