import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-get-row",
  name: "Get Row",
  description:
    "Retrieve a single row from a sheet by row ID, with cell values keyed by column name instead of column ID."
    + " Returns a human-readable object like `{\"Species\": \"Velociraptor\", \"Status\": \"Monitoring\"}` plus row metadata."
    + " When a cell has a displayValue (formatted date, contact name), that is returned instead of the raw value."
    + " Use **Get Sheet** or **Search** to find row IDs."
    + " To update a row after reading it, use **Update Row**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/row-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet containing the row. Use **List Sheets** to find sheet IDs.",
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row to retrieve. Use **Get Sheet** or **Search** to find row IDs.",
    },
  },
  async run({ $ }) {
    const [
      row,
      { byId },
    ] = await Promise.all([
      this.smartsheet.getRow(this.sheetId, this.rowId, {
        $,
      }),
      this.smartsheet.getColumnMap(this.sheetId, {
        $,
      }),
    ]);

    row.sheetId = this.sheetId;

    row.cellsByName = {};
    for (const cell of row.cells || []) {
      const name = byId[cell.columnId] || `Column ${cell.columnId}`;
      row.cellsByName[name] = cell.displayValue || cell.value;
    }

    $.export("$summary", `Retrieved row ${this.rowId} from sheet ${this.sheetId}`);
    return row;
  },
};
