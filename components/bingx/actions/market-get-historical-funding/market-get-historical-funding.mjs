import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get History Funding",
  version: "0.0.3",
  key: "bingx-market-get-historical-funding",
  description: "Funding Rate History [reference](https://bingx-api.github.io/docs/swap/market-api.html#_6-funding-rate-history).",
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
    const API_PATH = "/api/v1/market/getHistoryFunding";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Historical Funding Rate for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
