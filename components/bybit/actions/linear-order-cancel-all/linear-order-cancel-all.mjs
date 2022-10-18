import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Order Cancel All",
  version: "0.0.1",
  key: "bybit-linear-order-cancel-all",
  description: "Cancel All Active Orders." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-cancelallactive)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/order/cancel-all";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Active Orders Cancelled Successfully");
    }
    return returnValue;
  },
};
