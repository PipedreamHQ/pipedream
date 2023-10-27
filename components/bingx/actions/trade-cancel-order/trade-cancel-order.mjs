import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-trade-cancel-order",
  name: "BingX Trade Cancel Order",
  description: "Cancel an Order [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Cancel%20an%20Order).",
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
    orderId: {
      propDefinition: [
        bingx,
        "pendingOrderIds",
        (c) => ({
          symbol: c.symbol,
        }),
      ],
      label: "Order ID",
      description: "The Order ID to cancel",
    },
  },
  async run({ $ }) {
    const API_METHOD = "DELETE";
    const API_PATH = "/openApi/swap/v2/trade/order";
    const parameters = {
      "symbol": this.symbol,
      "orderId": this.orderId,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Cancel Order ${this.orderId} for ${this.symbol}`);
    return returnValue;
  },
};
