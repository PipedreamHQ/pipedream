import bybit from "../../bybit.app.mjs";
import { TRIGGER_PRICE_TYPES } from "../../common.mjs";

export default {
  name: "ByBit Market Query Kline",
  version: "0.0.1",
  key: "bybit-market-query-kline",
  description: "Get kline.[reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-querykline)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    triggerPriceType: {
      propDefinition: [
        bybit,
        "triggerPriceType",
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
    const API_PATH = TRIGGER_PRICE_TYPES[this.triggerPriceType];
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this, [
      "triggerPriceType",
    ]);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get kline Successful");
    }
    return returnValue;
  },
};
