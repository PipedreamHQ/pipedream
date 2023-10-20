import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade One Click Close Position",
  version: "0.0.3",
  key: "bingx-trade-oneclick-close-position",
  description: "One-Click Close Position [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_2-one-click-close-position).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    positionId: {
      propDefinition: [
        bingx,
        "positionId",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/oneClickClosePosition";
    const parameters = {
      "symbol": this.symbol,
      "positionId": this.positionId,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Oneclick close position ${this.positionId} for ${this.symbol}`);
    return returnValue;
  },
};
