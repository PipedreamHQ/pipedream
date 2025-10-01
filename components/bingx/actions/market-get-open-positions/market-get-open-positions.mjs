import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get Open Positions",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-open-positions",
  description: "Get Swap Open Positions [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Get%20Swap%20Open%20Positions).",
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
    const returnValue = await this.bingx.makeRequest({
      path: "/quote/openInterest",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Open Positions of Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
