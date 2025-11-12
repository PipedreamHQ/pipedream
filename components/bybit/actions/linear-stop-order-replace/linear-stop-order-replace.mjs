import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Stop Order Replace",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-stop-order-replace",
  description: "Replace conditional order." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-replacecond)",
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
    p_r_trigger_price: {
      propDefinition: [
        bybit,
        "stop_px",
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
    const API_PATH = "/private/linear/stop-order/replace";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Replace Stop Order Successful");
    }
    return returnValue;
  },
};
