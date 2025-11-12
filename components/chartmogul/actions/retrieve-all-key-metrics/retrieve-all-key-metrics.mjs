import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-all-key-metrics",
  name: "Retrieve All Key Metrics",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves all key metrics, for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-all-key-metrics)",
  type: "action",
  props: {
    ...common.props,
    interval: {
      propDefinition: [
        common.props.chartmogul,
        "interval",
      ],
      optional: true,
    },
  },
  methods: {
    getMetric() {
      return "all";
    },
    getSummary() {
      return "Key metrics Successfully retrieved";
    },
  },
};
