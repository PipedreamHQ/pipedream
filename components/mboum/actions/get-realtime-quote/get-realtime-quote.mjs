import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-realtime-quote",
  name: "Get Realtime Quote",
  description: "Get real-time stock quote data including current price, volume, and market data. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-quote)",
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
    type: {
      type: "string",
      label: "Type",
      description: "Type of quote to retrieve",
      options: [
        "STOCKS",
        "ETF",
        "MUTUALFUNDS",
        "FUTURES",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getRealtimeQuote({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
      },
    });

    $.export("$summary", `Successfully retrieved realtime quote for ${this.ticker}`);
    return response;
  },
};
