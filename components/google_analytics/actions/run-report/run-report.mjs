import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-run-report",
  version: "0.1.0",
  name: "Run Report",
  description: "Return report metrics based on a start and end date. [See the docs here](https://developers.google.com/analytics/devguides/reporting/core/v4/rest?hl=en)",
  type: "action",
  props: {
    analytics,
    viewId: {
      propDefinition: [
        analytics,
        "viewId",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in YYYY-MM-DD format",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date in YYYY-MM-DD format",
    },
    metrics: {
      type: "string[]",
      label: "Metrics",
      description: "Metrics attributes for your data. Explore the available metrics and dimensions [here](https://ga-dev-tools.web.app/dimensions-metrics-explorer/)",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      description: "Dimension attributes for your data. Explore the available metrics and dimensions [here](https://ga-dev-tools.web.app/dimensions-metrics-explorer/)",
      optional: true,
    },
  },
  async run({ $ }) {
    const metrics = this.metrics || [];
    const dimensions = this.dimensions || [];

    const data = {
      resource: {
        reportRequests: [
          {
            viewId: this.viewId,
            dateRanges: [
              {
                startDate: this.startDate,
                endDate: this.endDate,
              },
            ],
            dimensions: dimensions.map((dimension) => ({
              name: dimension,
            })),
            metrics: metrics.map((metric) => ({
              expression: metric,
            })),
          },
        ],
      },
    };
    const { data: report } = await this.analytics.queryReports(data);
    $.export("$summary", `Successfully retrieved report for view with ID ${this.viewId}`);
    return report;
  },
};
