import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get History Funding",
  version: "0.0.4",
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
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/quote/fundingRate";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Historical Funding Rate for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
