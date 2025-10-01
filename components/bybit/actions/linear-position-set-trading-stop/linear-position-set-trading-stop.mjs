import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Position Set Trading stop",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-position-set-trading-stop",
  description: "Set take profit, stop loss, and trailing stop for your open position. " +
      "If using partial mode, TP/SL/TS orders will not close your entire position. " +
      "[reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-placeactive)",
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
    trailing_stop: {
      propDefinition: [
        bybit,
        "trailing_stop",
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
    sl_size: {
      propDefinition: [
        bybit,
        "sl_size",
      ],
    },
    tp_size: {
      propDefinition: [
        bybit,
        "tp_size",
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
    const API_PATH = "/private/linear/position/trading-stop";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Set Trading Stop Successfully");
    }
    return returnValue;
  },
};
