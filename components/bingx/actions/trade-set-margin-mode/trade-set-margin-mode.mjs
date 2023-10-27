import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Set Margin Mode",
  version: "0.0.4",
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
    const API_METHOD = "POST";
    const API_PATH = "/openApi/swap/v2/trade/marginType";
    const parameters = {
      "symbol": this.symbol,
      "marginType": this.marginMode,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Set Margin Mode ${this.marginMode} for ${this.symbol}`);
    return returnValue;
  },
};
