import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-get-metric-data",
  name: "Get Metric Data",
  description:
    "Query time-series metric data with support for"
    + " custom queries and aggregations."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "metrics/#query-timeseries-data-across-multiple-products)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    datadog,
    region: {
      propDefinition: [
        datadog,
        "region",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description:
        "Metric query string."
        + " E.g. `avg:system.cpu.user{*}` or"
        + " `sum:my.metric{env:prod} by {host}`."
        + " [See query syntax](https://docs.datadoghq.com/"
        + "dashboards/querying/)",
    },
    from: {
      type: "integer",
      label: "From",
      description:
        "Start of the query window as POSIX timestamp"
        + " (seconds).",
    },
    to: {
      type: "integer",
      label: "To",
      description:
        "End of the query window as POSIX timestamp"
        + " (seconds).",
    },
  },
  async run({ $ }) {
    const response = await this.datadog.queryMetricData({
      $,
      params: {
        query: this.query,
        from: this.from,
        to: this.to,
      },
      region: this.region,
    });

    const count = response?.series?.length ?? 0;
    $.export(
      "$summary",
      `Retrieved ${count} time series`,
    );

    return response;
  },
};
