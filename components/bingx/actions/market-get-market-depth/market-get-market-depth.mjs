import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Market Depth",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const returnValue = await this.bingx.makeRequest({
      path: "/quote/depth",
      params: {
        symbol: this.symbol,
        level: this.level,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Market depth of Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
