import datadog from "../../datadog.app.mjs";
import constants from "../common/constants.mjs";
import lodash from "lodash";
const {
  pick,
  pickBy,
} = lodash;
const { MetricType } = constants;

export default {
  key: "datadog-post-metric-data",
  name: "Post Metric Data",
  description: "The metrics end-point allows you to post time-series data that can be graphed on Datadog's dashboards. [See docs](https://docs.datadoghq.com/metrics)",
  version: "0.0.1",
  type: "action",
  props: {
    datadog,
    host: {
      propDefinition: [
        datadog,
        "host",
      ],
      optional: true,
    },
    metric: {
      propDefinition: [
        datadog,
        "metric",
        (c) => ({
          host: c.host,
        }),
      ],
    },
    points: {
      type: "object",
      label: "Points",
      description: "Points relating to a metric. The `key` should be the an Unix timestamp in seconds and `value` should be the point value. Example: `{ \"1640995200\": 1.0 , \"1640998800\": 1.1, \"1641002400\": 1.2 }`. This field will be converted to the expected value for Datadog API",
    },
    tags: {
      propDefinition: [
        datadog,
        "tags",
        (c) => ({
          hostName: c.host,
        }),
      ],
    },
    metricType: {
      propDefinition: [
        datadog,
        "metricType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.metricType === MetricType.RATE || this.metricType === MetricType.COUNT) {
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
    const params = pickBy(pick(this, [
      "metric",
      "host",
      "tags",
      "metricType",
      "interval",
    ]));
    params.points = this.convertMetricPoints(this.points);

    const response = await this.datadog.postMetricData({
      series: [
        params,
      ],
    });
    $.export("$summary", `Posted metric to ${this.metric} timeseries`);
    return response;
  },
};
