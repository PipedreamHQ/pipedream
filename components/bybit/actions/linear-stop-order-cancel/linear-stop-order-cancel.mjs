import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Stop Order Cancel",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-stop-order-cancel",
  description: "Cancel Conditional Order." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-cancelcond)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    stop_order_id: {
      propDefinition: [
        bybit,
        "order_id",
      ],
    },
    order_link_id: {
      propDefinition: [
        bybit,
        "order_link_id",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/stop-order/cancel";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Conditional Order Cancel Successful");
    }
    return returnValue;
  },
};
