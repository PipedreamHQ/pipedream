import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic Market Order Book",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-generic-market-order-book",
  description: "Get Order Book.[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-orderbook)",
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
    const API_PATH = "/v2/public/orderBook/L2";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get Order Book Successful");
    }
    return returnValue;
  },
};
