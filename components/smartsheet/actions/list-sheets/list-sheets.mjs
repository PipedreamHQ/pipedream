import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-sheets",
  name: "List Sheets",
  description:
    "List all sheets the authenticated user can access, with name, ID, creation/modification dates, owner, and permalink."
    + " Use this to find sheet IDs before calling **Get Sheet**, **Add Rows**, **Update Rows**, **Delete Rows**, **Copy Sheet**, or **Move Sheet**."
    + " To search sheets by content rather than listing them, use **Search** instead."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/list-sheets)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    modifiedSince: {
      type: "string",
      label: "Modified Since",
      description: "Only return sheets modified after this date. ISO 8601 format, e.g. `2024-01-01T00:00:00Z`.",
      optional: true,
    },
    includeAll: {
      type: "boolean",
      label: "Include All",
      description: "Set to `true` to return all sheets in a single response without pagination.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      ...(this.modifiedSince ? { modifiedSince: this.modifiedSince } : {}),
      ...(this.includeAll ? { includeAll: true } : {}),
    };

    const response = await this.smartsheet.listSheets({
      $,
      params,
    });
    $.export("$summary", `Found ${response.data?.length || 0} sheet(s)`);
    return response;
  },
};
