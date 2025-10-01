import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-arr",
  name: "Retrieve ARR",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Annualized Run Rate (ARR), for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-arr)",
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
      return "arr";
    },
    getSummary() {
      return "ARR Successfully retrieved";
    },
  },
};
