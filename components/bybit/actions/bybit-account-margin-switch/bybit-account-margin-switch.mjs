import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Margin Switch",
  version: "0.0.1",
  key: "bybit-account-margin-switch",
  description: "Switch Cross/Isolated; must set leverage value when switching from Cross to Isolated." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-marginswitch)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    is_isolated: {
      propDefinition: [
        bybit,
        "is_isolated",
      ],
    },
    buy_leverage: {
      propDefinition: [
        bybit,
        "buy_leverage",
      ],
    },
    sell_leverage: {
      propDefinition: [
        bybit,
        "sell_leverage",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/position/switch-isolated";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Switch Margin Successful");
    }
    return returnValue;
  },
};
