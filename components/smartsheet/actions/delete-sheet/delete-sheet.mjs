import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-sheet",
  name: "Delete Sheet",
  description:
    "Permanently delete a sheet. This is irreversible — all data, rows, and columns are destroyed."
    + " Use **List Sheets** to find the sheet ID first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/deletesheet)",
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
      description: "The ID of the sheet to delete. Use **List Sheets** to find sheet IDs. WARNING: This is irreversible.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.deleteSheet(this.sheetId, {
      $,
    });
    $.export("$summary", `Deleted sheet ${this.sheetId}`);
    return response;
  },
};
