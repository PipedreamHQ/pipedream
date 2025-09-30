import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Market Recent Trading Records",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-linear-market-recent-trading-records",
  description: "Get recent trades.[reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-latestsymbolinfo)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    limit: {
      propDefinition: [
        bybit,
        "limit",
      ],
      max: 1000,
      description: "Limit for data size, max size is 1000. Default as showing 500 pieces of data",
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/public/linear/recent-trading-records";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get recent trades Successful");
    }
    return returnValue;
  },
};
