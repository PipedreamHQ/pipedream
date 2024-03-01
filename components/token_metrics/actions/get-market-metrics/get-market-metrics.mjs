import tokenMetrics from "../../token_metrics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "token_metrics-get-market-metrics",
  name: "Get Market Metrics",
  description: "Get the market analytics from Token Metrics. [See the documentation](https://developers.tokenmetrics.com/reference/market-metrics)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tokenMetrics,
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tokenMetrics.getMarketMetrics({
      startDate: this.startDate,
      endDate: this.endDate,
    });

    $.export("$summary", `Retrieved market metrics from ${this.startDate} to ${this.endDate}`);
    return response;
  },
};
