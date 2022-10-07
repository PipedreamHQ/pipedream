import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade OneClickCloseAllPositions",
  version: "0.0.2",
  key: "bingx-trade-oneclick-close-all-positions",
  description: "One-Click Close All Positions [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_3-one-click-close-all-positions).",
  props: {
    bingx,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/oneClickClosePosition";
    const parameters = {};
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Oneclick close all positions");
    return returnValue;
  },
};
