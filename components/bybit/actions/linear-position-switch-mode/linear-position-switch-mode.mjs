import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Position Switch Mode",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-position-switch-mode",
  description: "If you are in One-Way Mode, you can only open one position on Buy or Sell side. " +
      "If you are in Hedge Mode, you can open both Buy and Sell side positions simultaneously.\n" +
      "Supports switching between One-Way Mode and Hedge Mode at the coin level.." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-marginswitch)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
      optional: true,
    },
    coin: {
      propDefinition: [
        bybit,
        "coin",
      ],
    },
    mode: {
      propDefinition: [
        bybit,
        "mode",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/position/switch-mode";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Switch Position Mode Successful");
    }
    return returnValue;
  },
};
