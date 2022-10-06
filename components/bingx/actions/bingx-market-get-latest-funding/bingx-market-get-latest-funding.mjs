import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market getLatestFunding",
  version: "0.0.2",
  key: "bingx-market-get-latest-funding",
  description: "Current Funding Rate [reference](https://bingx-api.github.io/docs/swap/market-api.html#_5-current-funding-rate).",
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
    const API_PATH = "/api/v1/market/getLatestFunding";
    const parameters = {
      "symbol": this.symbol,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Current Funding Rate for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
