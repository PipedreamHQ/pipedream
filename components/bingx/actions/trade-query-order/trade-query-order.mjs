import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade QueryOrder",
  version: "0.0.3",
  key: "bingx-trade-query-order",
  description: "Query Order Details [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_8-query-order-details).",
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
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/queryOrderStatus";
    const parameters = {
      "symbol": this.symbol,
      "orderId": this.orderId,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Query Order ${this.orderId} for ${this.symbol}`);
    return returnValue;
  },
};
