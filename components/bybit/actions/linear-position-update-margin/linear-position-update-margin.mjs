import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Position Update Margin",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-position-update-margin",
  description: "Add Reduce Margin." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-addmargin)",
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
    margin: {
      propDefinition: [
        bybit,
        "margin",
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
    const API_PATH = "/private/linear/position/add-margin";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Margin Update Successful");
    }
    return returnValue;
  },
};
