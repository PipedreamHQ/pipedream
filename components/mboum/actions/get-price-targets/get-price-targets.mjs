import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-price-targets",
  name: "Get Price Targets",
  description: "Get analyst price targets and recommendations for a stock including target highs, lows, and consensus. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-price-targets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    ticker: {
      propDefinition: [
        mboum,
        "ticker",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getPriceTargets({
      $,
      params: {
        ticker: this.ticker,
      },
    });

    $.export("$summary", `Successfully retrieved price targets for ${this.ticker}`);
    return response;
  },
};
