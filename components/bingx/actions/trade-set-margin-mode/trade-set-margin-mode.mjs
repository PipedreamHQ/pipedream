import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Set Margin Mode",
  version: "0.0.3",
  key: "bingx-trade-set-margin-mode",
  description: "Switch Margin Mode [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_9-switch-margin-mode).",
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
    const API_PATH = "/api/v1/user/setMarginMode";
    const parameters = {
      "symbol": this.symbol,
      "marginMode": this.marginMode,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Set Margin Mode ${this.marginMode} for ${this.symbol}`);
    return returnValue;
  },
};
