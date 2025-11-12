import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Order Replace",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-order-replace",
  description: "Replace active order." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-replaceactive)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    order_id: {
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
    p_r_qty: {
      propDefinition: [
        bybit,
        "qty",
      ],
    },
    p_r_price: {
      propDefinition: [
        bybit,
        "price",
      ],
    },
    take_profit: {
      propDefinition: [
        bybit,
        "take_profit",
      ],
    },
    stop_loss: {
      propDefinition: [
        bybit,
        "stop_loss",
      ],
    },
    tp_trigger_by: {
      propDefinition: [
        bybit,
        "tp_trigger_by",
      ],
    },
    sl_trigger_by: {
      propDefinition: [
        bybit,
        "sl_trigger_by",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/order/replace";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Replace Active Order Successful");
    }
    return returnValue;
  },
};
