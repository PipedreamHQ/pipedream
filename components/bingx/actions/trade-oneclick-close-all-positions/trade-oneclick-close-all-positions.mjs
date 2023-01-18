import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade One Click Close All Positions",
  version: "0.0.3",
  key: "bingx-trade-oneclick-close-all-positions",
  description: "One-Click Close All Positions [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_3-one-click-close-all-positions).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/oneClickClosePosition";
    const parameters = {};
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Oneclick close all positions");
    return returnValue;
  },
};
