import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Position TL/SL Switch",
  version: "0.0.1",
  key: "bybit-account-position-tpsl-switch",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/tpsl/switch-mode";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Switch Position TPSL Mode Successful");
    }
    return returnValue;
  },
};
