import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Cancel All Orders",
  version: "0.0.4",
  key: "bingx-trade-cancel-all-orders",
  description: "Cancel All Orders [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20All%20Orders).",
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
    const API_METHOD = "DELETE";
    const API_PATH = "/openApi/swap/v2/trade/allOpenOrders";
    const parameters = {
      symbol: this.symbol,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Cancel all orders");
    return returnValue;
  },
};
