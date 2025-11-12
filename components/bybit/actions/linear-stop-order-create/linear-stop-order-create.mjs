import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Stop Order Create",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-stop-order-create",
  description: "Place Conditional Order." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-placecond)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    side: {
      propDefinition: [
        bybit,
        "side",
      ],
    },
    order_type: {
      propDefinition: [
        bybit,
        "order_type",
      ],
    },
    qty: {
      propDefinition: [
        bybit,
        "qty",
      ],
    },
    price: {
      propDefinition: [
        bybit,
        "price",
      ],
    },
    base_price: {
      propDefinition: [
        bybit,
        "base_price",
      ],
    },
    stop_px: {
      propDefinition: [
        bybit,
        "stop_px",
      ],
    },
    time_in_force: {
      propDefinition: [
        bybit,
        "time_in_force",
      ],
    },
    trigger_by: {
      propDefinition: [
        bybit,
        "trigger_by",
      ],
    },
    reduce_only: {
      propDefinition: [
        bybit,
        "reduce_only",
      ],
    },
    close_on_trigger: {
      propDefinition: [
        bybit,
        "close_on_trigger",
      ],
    },
    order_link_id: {
      propDefinition: [
        bybit,
        "order_link_id",
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
    position_idx: {
      propDefinition: [
        bybit,
        "position_idx",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/stop-order/create";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Conditional Order Placed Successfully");
    }
    return returnValue;
  },
};
