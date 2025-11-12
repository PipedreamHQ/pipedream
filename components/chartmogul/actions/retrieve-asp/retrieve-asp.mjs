import common from "../common/base-metrics.mjs";

export default {
  ...common,
  key: "chartmogul-retrieve-asp",
  name: "Retrieve Average Sale Price ASP",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the Average Sale Price (ASP), for the specified time period. [See the docs here](https://dev.chartmogul.com/reference/retrieve-asp)",
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
      return "asp";
    },
    getSummary() {
      return "ASP Successfully retrieved";
    },
  },
};
