import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account Get Positions",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-account-get-positions",
  description: "Perpetual Swap Positions [See the documentation](https://bingx-api.github.io/docs/#/swapV2/account-api.html#Perpetual%20Swap%20Positions).",
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
      path: "/user/positions",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Positions retrieved for symbol \`${this.symbol}\``);
    }
    return returnValue;
  },
};
