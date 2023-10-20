import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Open Positions",
  version: "0.0.3",
  key: "bingx-market-get-open-positions",
  description: "Get Swap Open Positions [reference](https://bingx-api.github.io/docs/swap/market-api.html#_9-get-swap-open-positions).",
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
    const API_PATH = "/api/v1/market/getOpenPositions";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Open Positions of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
