import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Set Leverage",
  version: "0.0.4",
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
    const API_METHOD = "POST";
    const API_PATH = "/openApi/swap/v2/trade/leverage";
    const parameters = {
      "symbol": this.symbol,
      "side": this.side,
      "leverage": this.leverage,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Set Leverage ${this.leverage} for ${this.side} of ${this.symbol}`);
    return returnValue;
  },
};
