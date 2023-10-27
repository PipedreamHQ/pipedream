import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Pending Orders",
  version: "0.0.4",
  key: "bingx-trade-pending-orders",
  description: "Unfilled Order Acquisition [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Query%20all%20current%20pending%20orders).",
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
    const API_PATH = "/openApi/swap/v2/trade/openOrders";
    const parameters = {
      "symbol": this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Pending orders for ${this.symbol}`);
    return returnValue;
  },
};
