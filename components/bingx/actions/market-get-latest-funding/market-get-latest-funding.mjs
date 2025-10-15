import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Latest Funding",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-latest-funding",
  description: "Current Funding Rate [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Current%20Funding%20Rate).",
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
      path: "/quote/premiumIndex",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Current Funding Rate for Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
