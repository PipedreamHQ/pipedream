import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-column",
  name: "Delete Column",
  description:
    "Permanently delete a column from a sheet. WARNING: This is irreversible - all cell data in the column is permanently destroyed."
    + " Use **List Columns** to find the column ID before deleting."
    + " Consider using **Get Sheet** to review the column's data before deletion."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/column-delete)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetIdOrUrl",
      ],
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The ID of the column to delete (e.g. `7894561230123456`). Use **List Columns** to find column IDs. WARNING: All cell data in this column will be permanently deleted.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.deleteColumn(sheetId, this.columnId, {
      $,
    });
    $.export("$summary", `Deleted column ${this.columnId} from sheet ${sheetId}`);
    return response;
  },
};
