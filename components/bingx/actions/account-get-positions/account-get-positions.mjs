import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account Get Positions",
  version: "0.0.4",
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
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/user/positions";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Positions retrieved for symbol \`${this.symbol}\``);
    return returnValue;
  },
};
