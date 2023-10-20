import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Cancel All Orders",
  version: "0.0.3",
  key: "bingx-trade-cancel-all-orders",
  description: "Cancel All Orders [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_6-cancel-all-orders).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/cancelAll";
    const parameters = {};
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Cancel all orders");
    return returnValue;
  },
};
