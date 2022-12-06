import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-post-metric-data",
  name: "Post Metric Data",
  description: "The metrics end-point allows you to post time-series data that can be graphed on Datadog's dashboards. [See docs](https://docs.datadoghq.com/metrics)",
  version: "0.1.1",
  type: "action",
  props: {
    datadog,
    metric: {
      propDefinition: [
        datadog,
        "metric",
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
      return Object.keys(points).map((point) => ([
        parseFloat(point),
        parseFloat(points[point]),
      ]));
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
    });

    $.export("$summary", `Posted to ${this.metric} timeseries`);

    return response;
  },
};
