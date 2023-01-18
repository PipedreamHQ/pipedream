import bingx from "../../bingx.app.mjs";

export default {
  key: "bingx-trade-cancel-order",
  name: "BingX Trade Cancel Order",
  description: "Cancel an Order [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_4-cancel-an-order).",
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
    orderId: {
      propDefinition: [
        bingx,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/cancelOrder";
    const parameters = {
      "symbol": this.symbol,
      "orderId": this.orderId,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Cancel Order ${this.orderId} for ${this.symbol}`);
    return returnValue;
  },
};
