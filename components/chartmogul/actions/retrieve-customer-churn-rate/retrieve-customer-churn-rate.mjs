import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-customer-churn-rate",
  name: "Retrieve Customer Churn Rate",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Customer Churn Rate, for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-customer-churn-rate)",
  type: "action",
  methods: {
    getMetric() {
      return "customer-churn-rate";
    },
    getSummary() {
      return "Customer Churn Rate Successfully retrieved";
    },
  },
};
