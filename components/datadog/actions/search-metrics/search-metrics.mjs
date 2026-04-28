import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-metrics",
  name: "Search Metrics",
  description:
    "Discovery tool: list available Datadog metric names,"
    + " optionally filtered by host. Returns metric name"
    + " strings (e.g. `system.cpu.user`,"
    + " `aws.ec2.cpuutilization`) for use in"
    + " **Get Metric Data** queries with the syntax"
    + " `aggregation:metric.name{tags}`. Use"
    + " **Search Hosts** to find valid host names for"
    + " the `host` filter."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/metrics/#get-active-metrics-list)",
  version: "1.0.1",
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
