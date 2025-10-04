import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic Market Big Deal",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-generic-market-big-deal",
  description: "Obtain filled orders worth more than 500,000 USD within the last 24h. " +
      "[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-marketbigdeal)",
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
    const API_PATH = "/v2/public/big-deal";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Big Deal Request Successful");
    }
    return returnValue;
  },
};
