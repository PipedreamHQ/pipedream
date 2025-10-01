import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-mrr",
  name: "Retrieve Monthly Recurring Revenue (MRR)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Monthly Recurring Revenue (MRR), for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-mrr)",
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
      return "mrr";
    },
    getSummary() {
      return "MRR Successfully retrieved";
    },
  },
};
