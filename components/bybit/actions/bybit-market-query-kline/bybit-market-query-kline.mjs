import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Market Query Kline",
  version: "0.0.1",
  key: "bybit-market-query-kline",
  description: "Get kline.[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-querykline)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    interval: {
      propDefinition: [
        bybit,
        "interval",
      ],
    },
    from: {
      propDefinition: [
        bybit,
        "from",
      ],
    },
    limit: {
      propDefinition: [
        bybit,
        "limit",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/public/linear/kline";
    console.log(this.interval);
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", "Get kline Successful");
    }
    return returnValue;
  },
};
