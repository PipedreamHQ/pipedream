import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetMarketDepth",
  version: "0.0.1",
  key: "bingx-market-get-market-depth",
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
    let returnValue = await this.bingx.getMarketDepth(this.symbol, this.level);
    $.export("$summary", `Market depth of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
