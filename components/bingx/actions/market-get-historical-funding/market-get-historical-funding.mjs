import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get History Funding",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-historical-funding",
  description: "Funding Rate History [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Current%20Funding%20Rate).",
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
      path: "/quote/fundingRate",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Historical Funding Rate for Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
