import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-rows",
  name: "Delete Rows",
  description:
    "Delete one or more rows from a sheet by row ID. This is permanent and cannot be undone."
    + " Use **Get Sheet** or **Search** to find row IDs first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/rows/delete-rows)",
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
      description: "The ID of the sheet containing the rows. Use **List Sheets** to find sheet IDs.",
    },
    rowIds: {
      type: "string",
      label: "Row IDs",
      description: "Comma-separated list of row IDs to delete. Example: `1234567890, 9876543210`. Use **Get Sheet** to find row IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.deleteRows(this.sheetId, {
      $,
      params: {
        ids: this.rowIds,
      },
    });
    $.export("$summary", `Deleted row(s) ${this.rowIds} from sheet ${this.sheetId}`);
    return response;
  },
};
