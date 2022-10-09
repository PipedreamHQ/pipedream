import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Set Auto Margin",
  version: "0.0.1",
  key: "bybit-account-set-auto-margin",
  description: "Place active order." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-setautoaddmargin)",
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
    auto_add_margin: {
      propDefinition: [
        bybit,
        "auto_add_margin",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/position/set-auto-add-margin";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Auto Margin Preference Update Successful");
    }
    return returnValue;
  },
};
