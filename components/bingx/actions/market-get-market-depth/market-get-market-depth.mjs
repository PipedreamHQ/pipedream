import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Market Depth",
  version: "0.0.4",
  key: "bingx-market-get-market-depth",
  description: "Get Market Depth [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Get%20Market%20Depth).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    level: {
      label: "Level",
      description: "Number of levels. If it is empty, it will return 5 levels of data by default.",
      type: "integer",
      optional: true,
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/quote/depth";
    const parameters = {
      "symbol": this.symbol,
      "level": this.level,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Market depth of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
