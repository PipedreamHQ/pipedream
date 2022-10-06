import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetLatestPrice",
  version: "0.0.1",
  key: "bingx-market-get-latest-price",
  description: "Get Latest Price of a Trading Pair [reference](https://bingx-api.github.io/docs/swap/market-api.html#_2-get-latest-price-of-a-trading-pair).",
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
    const API_PATH = "/api/v1/market/getLatestPrice";
    const parameters = {
      "symbol": this.symbol,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Latest Price of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
