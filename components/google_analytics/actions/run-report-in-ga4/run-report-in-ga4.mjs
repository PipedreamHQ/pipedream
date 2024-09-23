import analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-run-report-in-ga4",
  version: "0.1.0",
  name: "Run Report in GA4",
  description: "Returns a customized report of your Google Analytics event data. Reports contain statistics derived from data collected by the Google Analytics tracking code. [See the documentation here](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)",
  type: "action",
  props: {
    analytics,
    property: {
      type: "string",
      label: "Property",
      description: "A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body. To learn more, [see where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Within a batch request, this property should either be unspecified or consistent with the batch-level property.",
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
      description: "Metrics attributes for your data. Explore the available metrics [here](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics)",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      description: "Dimension attributes for your data. Explore the available dimensions [here](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions)",
      optional: true,
    },
    dimensionFilter: {
      type: "object",
      label: "Dimension filter",
      description: "Dimension filters let you ask for only specific dimension values in the report. Read more about dimension filters [here](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#dimension_filters)",
      optional: true,
    },
  },
  async run({ $ }) {
    const metrics = this.metrics || [];
    const dimensions = this.dimensions || [];

    const dimensionFilter = typeof this.dimensionFilter === "string"
      ? JSON.parse(this.dimensionFilter)
      : this.dimensionFilter;

    const data = {
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
        name: metric,
      })),
      dimensionFilter: dimensionFilter,
    };
    const report = await this.analytics.queryReportsGA4({
      property: this.property,
      data,
    });
    $.export("$summary", `Successfully retrieved report for the property ${this.property}`);
    return report;
  },
};
