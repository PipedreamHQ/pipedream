import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Pending Orders",
  version: "0.0.3",
  key: "bingx-trade-pending-orders",
  description: "Unfilled Order Acquisition [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_7-unfilled-order-acquisition).",
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
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/pendingOrders";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Pending orders for ${this.symbol}`);
    return returnValue;
  },
};
