import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-trade-batch-cancel-orders",
  name: "BingX Trade BatchCancelOrders",
  description: "Cancel a Batch of Orders [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_5-cancel-a-batch-of-orders).",
  version: "0.0.3",
  type: "action",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    orderIds: {
      propDefinition: [
        bingx,
        "pendingOrderIds",
        (c) => ({
          symbol: c.symbol,
        }),
      ],
    },
  },
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/batchCancelOrders";
    const parameters = {
      symbol: this.symbol,
      oids: this.orderIds.join(),
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Batch Cancel Orders for ${this.symbol}`);
    return returnValue;
  },
};
