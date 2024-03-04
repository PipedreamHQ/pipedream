import app from "../../token_metrics.app.mjs";

export default {
  key: "token_metrics-get-market-metrics",
  name: "Get Market Metrics",
  description: "Gets the market analytics from Token Metrics. [See the documentation](https://developers.tokenmetrics.com/reference/market-metrics)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMarketMetrics({
      $,
      params: {
        startDate: this.startDate,
        endDate: this.endDate,
        limit: this.limit,
      },
    });

    $.export("$summary", `Retrieved market metrics from ${this.startDate} to ${this.endDate}`);

    return response;
  },
};
