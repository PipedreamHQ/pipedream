// x-pd-ai: optimized
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-columns",
  name: "List Columns",
  description:
    "List all columns in a sheet, returning each column's ID, title, type, options (for PICKLIST/CONTACT_LIST), validation, and position index."
    + " This is lighter-weight than **Get Sheet** when you only need the column schema and not row data."
    + " Use this before **Add Row to Sheet** or **Update Row** to discover column names and types."
    + " For full sheet data including rows, use **Get Sheet** instead."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/columns-listonsheet)",
  version: "0.1.1",
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
      description: "The ID of the sheet (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs.",
    },
    level: {
      type: "integer",
      label: "Level",
      description: "Response format for multi-value columns. At the default level 0 a MULTI_PICKLIST or MULTI_CONTACT_LIST column is reported as TEXT_NUMBER for backwards compatibility, so pass `2` when you need the real column type.",
      options: [
        0,
        1,
        2,
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.listColumns(sheetId, {
      $,
      params: {
        includeAll: true,
        level: this.level,
      },
    });
    $.export("$summary", `Found ${response.data?.length || 0} column(s) in sheet ${sheetId}`);
    return response;
  },
};
