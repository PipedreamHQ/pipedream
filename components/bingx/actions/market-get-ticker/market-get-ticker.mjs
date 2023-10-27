import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Ticker",
  version: "0.0.4",
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
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/quote/ticker";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Ticker Information for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
