import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Market Latest Funding Rate",
  version: "0.0.1",
  key: "bybit-market-latest-funding-rate",
  description: "The funding rate is generated every 8 hours at 00:00 UTC, 08:00 UTC and 16:00 UTC. For example," +
      "if a request is sent at 12:00 UTC, the funding rate generated earlier that day at 08:00 UTC will be sent." +
      "[reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-query_liqrecords)",
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
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/public/linear/funding/prev-funding-rate";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", "Get Latest Funding Rate Successful");
    }
    return returnValue;
  },
};
