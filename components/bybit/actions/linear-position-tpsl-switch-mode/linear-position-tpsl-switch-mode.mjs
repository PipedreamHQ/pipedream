import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Position TP/SL Switch Mode",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-position-tpsl-switch",
  description: "Switch mode between Full or Partial. " +
      "When set to Partial, TP/SL orders may have a quantity less than the position size. " +
      "This is set with the Trading-Stop endpoint." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-switchpositionmode)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
      optional: true,
    },
    tp_sl_mode: {
      propDefinition: [
        bybit,
        "tp_sl_mode",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/tpsl/switch-mode";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Switch Position TPSL Mode Successful");
    }
    return returnValue;
  },
};
