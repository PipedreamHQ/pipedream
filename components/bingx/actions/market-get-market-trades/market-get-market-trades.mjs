import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Market Trades",
  version: "0.0.4",
  key: "bingx-market-get-market-trades",
  description: "The latest Trade of a Trading Pair [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Get%20Latest%20Price%20of%20a%20Trading%20Pair).",
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
    const returnValue = await this.bingx.getLatestPrice({
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Latest Trade of Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
