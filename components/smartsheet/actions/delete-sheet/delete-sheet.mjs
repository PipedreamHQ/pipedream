import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-delete-sheet",
  name: "Delete Sheet",
  description:
    "Permanently delete a sheet. This is irreversible - all data, rows, and columns are destroyed."
    + " Use **List Sheets** to find the sheet ID first."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/deletesheet)",
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
      type: "string",
      label: "Sheet ID or URL",
      description: "The ID of the sheet to delete (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs. WARNING: This is irreversible. A Smartsheet sheet URL is also accepted and resolved to the ID for you.",
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.deleteSheet(sheetId, {
      $,
    });
    $.export("$summary", `Deleted sheet ${sheetId}`);
    return response;
  },
};
