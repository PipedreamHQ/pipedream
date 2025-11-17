import app from "../../finnhub.app.mjs";

export default {
  key: "finnhub-get-recommentadion-trends",
  name: "Get Recommentadion Trends",
  description: "Get latest analyst recommendation trends for a company. [See the documentation](https://finnhub.io/docs/api/recommendation-trends)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getRecommentadionTrends({
      $,
      params: {
        symbol: this.symbol,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.length + " recommendation trends");
    return response;
  },
};
