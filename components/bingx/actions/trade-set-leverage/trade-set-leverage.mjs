import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Set Leverage",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bingx-trade-set-leverage",
  description: "Switch Leverage [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Switch%20Leverage).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    side: {
      propDefinition: [
        bingx,
        "leverageSide",
      ],
    },
    leverage: {
      propDefinition: [
        bingx,
        "leverage",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.setLeverage({
      params: {
        symbol: this.symbol,
        side: this.side,
        leverage: this.leverage,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Set Leverage ${this.leverage} for ${this.side} of ${this.symbol}`);
    }
    return returnValue;
  },
};
