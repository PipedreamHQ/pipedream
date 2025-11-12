import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Stop Order Cancel All",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-stop-order-cancel-all",
  description: "Cancel All Conditional Orders. " +
      "[reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-cancelallcond)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/stop-order/cancel-all";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Conditional Orders Cancel Request Successful");
    }
    return returnValue;
  },
};
