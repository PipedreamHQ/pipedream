import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetMarketDepth",
  version: "0.0.2",
  key: "market-get-market-depth",
  description: "Get Market Depth [reference](https://bingx-api.github.io/docs/swap/market-api.html#_3-get-market-depth).",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/api/v1/market/getMarketDepth";
    const parameters = {
      "symbol": this.symbol,
      "level": this.level,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Market depth of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
