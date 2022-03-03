import datadog from "../../datadog.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "datadog-post-metric-data",
  name: "Post Metric Data",
  description: "The metrics end-point allows you to post time-series data that can be graphed on Datadog's dashboards. [See docs](https://docs.datadoghq.com/metrics)",
  version: "0.0.1",
  type: "action",
  props: {
    datadog,
    metric: {
      type: "string",
      label: "Metric",
      description: "The name of the timeseries",
    },
    points: {
      type: "object",
      label: "Points",
      description: "Points relating to a metric. The `key` should be the an Unix timestamp in seconds and `value` should be the point value. Example: `{ \"1640995200\": 1.0 , \"1640998800\": 1.1, \"1641002400\": 1.2 }`. This field will be converted to the expected value for Datadog API",
    },
    host: {
      type: "string",
      label: "Host",
      description: "The name of the host that produced the metric",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags associated with the metric",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the metric",
      options: constants.metricTypes,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.type === "rate" || this.type === "count") {
      props.interval = {
        type: "integer",
        label: "Interval",
        description: "The corresponding interval in seconds for the metric aggregation",
      };
    }
    return props;
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
    const params = {
      metric: this.metric,
      points: this.convertMetricPoints(this.points),
    };
    if (this.host) params.host = this.host;
    if (this.tags) params.tags = this.tags;
    if (this.type) params.type = this.type;
    if (this.interval) params.interval = this.interval;

    const response = await this.datadog.postMetricData({
      series: [
        params,
      ],
    });
    $.export("$summary", `Posted metric to ${this.metric} timeseries`);
    return response;
  },
};
