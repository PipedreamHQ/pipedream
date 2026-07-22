import app from "../../mode.app.mjs";

export default {
  key: "mode-list-reports",
  name: "List Reports",
  description: "List the reports belonging to a specific space. The Mode API has no top-level list-all-reports endpoint, so a `space_token` is required. Use **List Spaces** to resolve a space token first. Use this tool to find `report_token` values for other report and query actions. [See the documentation](https://mode.com/developer/api-reference/analytics/reports/#listReportsInSpace)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    spaceToken: {
      propDefinition: [
        app,
        "spaceToken",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter reports by `created_at` or `updated_at` timestamp. Format: `{created_at|updated_at}.{gt|lt}.{ISO8601 datetime}`. Example: `created_at.gt.2019-10-23T06:23:01Z` returns all reports created after that date.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort direction for the results.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Timestamp field to sort by.",
      optional: true,
      options: [
        "created_at",
        "updated_at",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listReports({
      $,
      spaceToken: this.spaceToken,
      params: {
        filter: this.filter,
        order: this.order,
        order_by: this.orderBy,
      },
    });
    const reports = response?._embedded?.reports ?? response;
    const count = Array.isArray(reports)
      ? reports.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} report(s) from space "${this.spaceToken}"`);
    return response;
  },
};
