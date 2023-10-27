import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-trade-batch-cancel-orders",
  name: "BingX Trade Batch Cancel Orders",
  description: "Cancel a Batch of Orders [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20a%20Batch%20of%20Orders).",
  version: "0.0.4",
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
    const API_METHOD = "DELETE";
    const API_PATH = "openApi/swap/v2/trade/batchOrders";
    const parameters = {
      symbol: this.symbol,
      orderIdList: this.orderIds,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Batch Cancel Orders for ${this.symbol}`);
    return returnValue;
  },
};
