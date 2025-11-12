import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-ltv",
  name: "Retrieve Customer Lifetime Value",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Customer Lifetime Value (LTV), for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-ltv)",
  type: "action",
  methods: {
    getMetric() {
      return "ltv";
    },
    getSummary() {
      return "LTV Successfully retrieved";
    },
  },
};
