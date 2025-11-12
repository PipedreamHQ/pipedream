import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Ticker",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-ticker",
  description: "Get Ticker [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Get%20Ticker).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.makeRequest({
      path: "/quote/ticker",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Ticker Information for Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
