import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Market Long Short Ratio",
  version: "0.0.1",
  key: "bybit-market-long-short-ratio",
  description: "Gets the Bybit user accounts' long-short ratio.[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-marketaccountratio)",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/v2/public/account-ratio";
    console.log(this.interval);
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", "Long/Short Ratio Request Successful");
    }
    return returnValue;
  },
};
