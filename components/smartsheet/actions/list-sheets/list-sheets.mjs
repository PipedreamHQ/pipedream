import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-sheets",
  name: "List Sheets",
  description:
    "List all sheets the authenticated user can access, with name, ID, creation/modification dates, owner, and permalink."
    + " Always returns the complete list in a single call (no pagination to manage)."
    + " Use this to find sheet IDs before calling **Get Sheet**, **Add Row to Sheet**, **Update Row**, **Delete Rows**, **Copy Sheet**, or **Move Sheet**."
    + " To search sheets by content rather than listing them, use **Search** instead."
    + " Example: `{modifiedSince: \"2024-01-01T00:00:00Z\"}` returns only sheets modified since that date, e.g."
    + " `{\"data\": [{\"id\": \"1234567890123456\", \"name\": \"Jurassic Park Operations\", ...}]}`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/list-sheets)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
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
  },
  async run({ $ }) {
    const params = {
      modifiedSince: this.modifiedSince,
      // Always fetch the complete list in one call — the API paginates by
      // default and there's no page/cursor param exposed here for an agent
      // to continue with, so silently returning only page 1 would be worse
      // than a single larger response.
      includeAll: true,
    };

    const response = await this.smartsheet.listSheets({
      $,
      params,
    });
    $.export("$summary", `Found ${response.data?.length || 0} sheet(s)`);
    return response;
  },
};
