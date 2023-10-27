import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade One Click Close All Positions",
  version: "0.0.5",
  key: "bingx-trade-oneclick-close-all-positions",
  description: "One-Click Close All Positions [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#One-Click%20Close%20All%20Positions).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/openApi/swap/v2/trade/closeAllPositions";
    const parameters = {};
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Oneclick close all positions");
    return returnValue;
  },
};
