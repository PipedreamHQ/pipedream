import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-arpa",
  name: "Retrieve Average Revenue Per Account (ARPA)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Average Revenue Per Account (ARPA), for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-arpa)",
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
      return "arpa";
    },
    getSummary() {
      return "ARPA Successfully retrieved";
    },
  },
};
