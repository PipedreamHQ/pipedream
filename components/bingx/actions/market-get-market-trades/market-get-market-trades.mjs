import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Market Trades",
  version: "0.0.3",
  key: "bingx-market-get-market-trades",
  description: "The latest Trade of a Trading Pair [reference](https://bingx-api.github.io/docs/swap/market-api.html#_4-the-latest-trade-of-a-trading-pair).",
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
    const API_METHOD = "GET";
    const API_PATH = "/api/v1/market/getMarketTrades";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Latest Trade of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
