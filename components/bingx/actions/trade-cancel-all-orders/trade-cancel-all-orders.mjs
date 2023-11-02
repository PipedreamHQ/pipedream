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
    const returnValue = await this.bingx.makeRequest({
      path: "/trade/allOpenOrders",
      method: "DELETE",
      params: {
        symbol: this.symbol,
      },
      $,
    });
    $.export("$summary", "Cancel all orders");
    return returnValue;
  },
};
