import app from "../../mode.app.mjs";

export default {
  key: "mode-list-report-runs",
  name: "List Report Runs",
  description: "List the runs for a given report. [See the documentation](https://mode.com/developer/api-reference/analytics/report-runs/#listReportRuns)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    reportToken: {
      propDefinition: [
        app,
        "reportToken",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter runs by `created_at` or `updated_at` timestamp. Format: `{created_at|updated_at}.{gt|lt}.{ISO8601 datetime}`. Example: `updated_at.lt.2019-10-23T06:23:01Z` returns all runs updated before that date.",
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
    const response = await this.app.listReportRuns({
      $,
      reportToken: this.reportToken,
      params: {
        filter: this.filter,
        order: this.order,
        order_by: this.orderBy,
      },
    });
    const runs = response?._embedded?.report_runs ?? response;
    const count = Array.isArray(runs)
      ? runs.length
      : 0;
    $.export("$summary", `Successfully retrieved ${count} run(s) for report "${this.reportToken}"`);
    return response;
  },
};
