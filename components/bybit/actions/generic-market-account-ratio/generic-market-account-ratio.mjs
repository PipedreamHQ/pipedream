import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic Market Account Ratio",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-generic-market-account-ratio",
  description: "Gets the Bybit user accounts' long-short ratio." +
      "[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-marketaccountratio)",
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
      description: "Limit for data size, max size is `200`. Default as showing `50` pieces of data",
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/v2/public/account-ratio";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Long/Short Ratio Request Successful");
    }
    return returnValue;
  },
};
