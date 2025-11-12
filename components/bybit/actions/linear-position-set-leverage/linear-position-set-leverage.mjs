import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Position Set Leverage",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-position-set-leverage",
  description: "Set Leverage [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-setleverage)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
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
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/position/set-leverage";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Set Leverage Successful");
    }
    return returnValue;
  },
};
