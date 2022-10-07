import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade BatchCancelOrders",
  version: "0.0.2",
  key: "bingx-trade-batch-cancel-orders",
  description: "Cancel a Batch of Orders [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_5-cancel-a-batch-of-orders).",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/batchCancelOrders";
    const parameters = {
      "symbol": this.symbol,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Batch Cancel Orders for ${this.symbol}`);
    return returnValue;
  },
};
