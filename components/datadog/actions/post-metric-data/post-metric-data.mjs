import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-post-metric-data",
  name: "Post Metric Data",
  description:
    "Post custom time-series metric data points to"
    + " Datadog. Data appears in dashboards, monitors,"
    + " and can be queried via **Get Metric Data**."
    + " Points: JSON object where keys are Unix"
    + " timestamps (seconds) and values are numeric,"
    + " e.g. `{\"1640995200\": 1.0}`. Use"
    + " **Search Metrics** to verify a metric name"
    + " exists, or post to a new name to create it."
    + " This is a WRITE operation that creates or"
    + " appends data to a metric time series."
    + " [See the docs](https://docs.datadoghq.com/"
    + "metrics)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    datadog,
    region: {
      propDefinition: [
        datadog,
        "region",
      ],
    },
    metric: {
      propDefinition: [
        datadog,
        "metric",
        (c) => ({
          region: c.region,
        }),
      ],
    },
    points: {
      type: "object",
      label: "Points",
      description: "Points relating to a metric. The `key` should be the an Unix timestamp in seconds and `value` should be the point value. Example: `{ \"1640995200\": 1.0 , \"1640998800\": 1.1, \"1641002400\": 1.2 }`. This field will be converted to the expected value for Datadog API",
    },
  },
  methods: {
    convertMetricPoints(points) {
      return Object.keys(points).map((point) => ({
        timestamp: parseFloat(point),
        value: parseFloat(points[point]),
      }));
    },
  },
  async run({ $ }) {
    const response = await this.datadog.postMetricData({
      $,
      data: {
        series: [
          {
            metric: this.metric,
            points: this.convertMetricPoints(this.points),
          },
        ],
      },
      region: this.region,
    });

    $.export("$summary", `Posted to ${this.metric} timeseries`);

    return response;
  },
};
