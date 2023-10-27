import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Latest Funding",
  version: "0.0.4",
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
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/quote/premiumIndex";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Current Funding Rate for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
