import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-trade-cancel-order",
  name: "BingX Trade Cancel Order",
  description: "Cancel an Order [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20an%20Order).",
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
    orderId: {
      propDefinition: [
        bingx,
        "pendingOrderIds",
        (c) => ({
          symbol: c.symbol,
        }),
      ],
      type: "string",
      label: "Order ID",
      description: "The Order ID to cancel",
    },
  },
  async run({ $ }) {
    const returnValue = await this.bingx.makeRequest({
      path: "/trade/order",
      method: "DELETE",
      params: {
        symbol: this.symbol,
        orderId: this.orderId,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Cancel Order ${this.orderId} for ${this.symbol}`);
    }
    return returnValue;
  },
};
