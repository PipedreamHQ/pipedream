import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-customer-count",
  name: "Retrieve Customer Count",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the number of active customers, for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-customer-count)",
  type: "action",
  methods: {
    getMetric() {
      return "customer-count";
    },
    getSummary() {
      return "Customer Count Successfully retrieved";
    },
  },
};
