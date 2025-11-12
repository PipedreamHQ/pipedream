import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-mrr-churn-reate",
  name: "Retrieve MRR Churn Rate",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Net MRR Churn Rate, for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-mrr-churn-rate)",
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
      return "mrr-churn-rate";
    },
    getSummary() {
      return "MRR Churn Rate Successfully retrieved";
    },
  },
};
