import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-analyst-ratings",
  name: "Get Analyst Ratings",
  description: "Get analyst ratings and recommendations for a stock including buy/sell/hold ratings. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-stock-analyst-ratings)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    ticker: {
      propDefinition: [
        mboum,
        "ticker",
      ],
    },
    page: {
      propDefinition: [
        mboum,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getAnalystRatings({
      $,
      params: {
        ticker: this.ticker,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully retrieved analyst ratings for ${this.ticker}`);
    return response;
  },
};
