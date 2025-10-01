import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Position List",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-linear-position-list",
  description: "Get Positions List" +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-myposition)",
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
    const API_METHOD = "GET";
    const API_PATH = "/private/linear/position/list";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Position List Request Successfully");
    }
    return returnValue;
  },
};
