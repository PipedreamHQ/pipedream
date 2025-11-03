import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic Market Tickers",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-generic-market-tickers",
  description: "Get the latest information for symbol. [reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-latestsymbolinfo)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
      optional: true,
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/v2/public/tickers";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get Ticker Information Successful");
    }
    return returnValue;
  },
};
