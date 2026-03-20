import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-metrics",
  name: "Search Metrics",
  description:
    "List available metrics with filtering by host."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "metrics/#get-active-metrics-list)",
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
    host: {
      type: "string",
      label: "Host",
      description:
        "Filter metrics by host name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.datadog.listActiveMetrics({
      $,
      params: {
        from: 1,
        host: this.host,
      },
      region: this.region,
    });

    const count = response?.metrics?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} metric${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
