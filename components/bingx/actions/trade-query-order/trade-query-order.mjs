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
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/trade/order";
    const parameters = {
      "symbol": this.symbol,
      "orderId": this.orderId,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Query Order ${this.orderId} for ${this.symbol}`);
    return returnValue;
  },
};
