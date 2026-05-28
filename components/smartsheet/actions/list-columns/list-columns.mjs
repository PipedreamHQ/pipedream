import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-columns",
  name: "List Columns",
  description:
    "List all columns in a sheet, returning each column's ID, title, type, options (for PICKLIST/CONTACT_LIST), validation, and position index."
    + " This is lighter-weight than **Get Sheet** when you only need the column schema and not row data."
    + " Use this before **Add Rows** or **Update Rows** to discover column names and types."
    + " For full sheet data including rows, use **Get Sheet** instead."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/columns-listonsheet)",
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
      description: "The ID of the sheet. Use **List Sheets** to find sheet IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.smartsheet.listColumns(this.sheetId, {
      $,
      params: {
        includeAll: true,
      },
    });
    $.export("$summary", `Found ${response.data?.length || 0} column(s) in sheet ${this.sheetId}`);
    return response;
  },
};
