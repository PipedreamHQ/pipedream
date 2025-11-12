import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Latest Price",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-latest-price",
  description: "Get Latest Price of a Trading Pair [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#The%20latest%20Trade%20of%20a%20Trading%20Pair).",
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
      path: "/quote/trades",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Latest Price of Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
