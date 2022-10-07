import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetOpenPositions",
  version: "0.0.2",
  key: "market-get-open-positions",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/api/v1/market/getOpenPositions";
    const parameters = {
      "symbol": this.symbol,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Open Positions of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
