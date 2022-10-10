import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic Market Open Interest",
  version: "0.0.1",
  key: "bybit-generic-market-open-interest",
  description: "Gets the total amount of unsettled contracts. In other words, the total number of contracts held " +
      "in open positions.[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-marketopeninterest)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    period: {
      propDefinition: [
        bybit,
        "period",
      ],
    },
    limit: {
      propDefinition: [
        bybit,
        "limit",
      ],
      max: 1000,
      description: "Limit for data size, max size is 200. Default as showing 50 pieces of data",
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/v2/public/open-interest";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Open Interest Request Successful");
    }
    return returnValue;
  },
};
