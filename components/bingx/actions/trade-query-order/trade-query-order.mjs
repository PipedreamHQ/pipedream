import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade Query Order",
  version: "0.0.4",
  key: "bingx-trade-query-order",
  description: "Query Order Details [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Query%20Order).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    orderId: {
      propDefinition: [
        bingx,
        "pendingOrderIds",
        (c) => ({
          symbol: c.symbol,
        }),
      ],
      label: "Order ID",
      description: "The Order ID to query",
    },
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.makeRequest({
      path: "/trade/order",
      params: {
        symbol: this.symbol,
        orderId: this.orderId,
      },
      $,
    });
    $.export("$summary", `Query Order ${this.orderId} for ${this.symbol}`);
    return returnValue;
  },
};
