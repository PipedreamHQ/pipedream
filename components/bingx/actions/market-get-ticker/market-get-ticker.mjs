import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Ticker",
  version: "0.0.3",
  key: "bingx-market-get-ticker",
  description: "Get Ticker [reference](https://bingx-api.github.io/docs/swap/market-api.html#_10-get-ticker).",
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
    const API_PATH = "/api/v1/market/getTicker";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Ticker Information for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
