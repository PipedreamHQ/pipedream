import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-column",
  name: "Delete Column",
  description:
    "Permanently delete a column from a sheet. WARNING: This is irreversible — all cell data in the column is permanently destroyed."
    + " Use **List Columns** to find the column ID before deleting."
    + " Consider using **Get Sheet** to review the column's data before deletion."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/column-delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet containing the column. Use **List Sheets** to find sheet IDs.",
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The ID of the column to delete. Use **List Columns** to find column IDs. WARNING: All cell data in this column will be permanently deleted.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.deleteColumn(this.sheetId, this.columnId, {
      $,
    });
    $.export("$summary", `Deleted column ${this.columnId} from sheet ${this.sheetId}`);
    return response;
  },
};
