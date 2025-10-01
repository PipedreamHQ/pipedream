import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-trade-batch-cancel-orders",
  name: "BingX Trade Batch Cancel Orders",
  description: "Cancel a Batch of Orders [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20a%20Batch%20of%20Orders).",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const returnValue = await this.bingx.makeRequest({
      path: "/trade/batchOrders",
      method: "DELETE",
      params: {
        symbol: this.symbol,
        orderIdList: this.orderIds,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Batch Cancel Orders for ${this.symbol}`);
    }
    return returnValue;
  },
};
