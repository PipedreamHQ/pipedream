import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Set Margin Mode",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bingx-trade-set-margin-mode",
  description: "Switch Margin Mode [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Switch%20Margin%20Mode).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    marginMode: {
      propDefinition: [
        bingx,
        "marginMode",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.makeRequest({
      path: "/trade/marginType",
      method: "POST",
      params: {
        symbol: this.symbol,
        marginType: this.marginMode,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Set Margin Mode ${this.marginMode} for ${this.symbol}`);
    }
    return returnValue;
  },
};
