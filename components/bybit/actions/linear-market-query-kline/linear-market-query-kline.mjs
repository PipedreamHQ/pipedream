import bybit from "../../bybit.app.mjs";
import { TRIGGER_PRICE_TYPES } from "../../common/constants.mjs";

export default {
  name: "ByBit Linear Market Query Kline",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-linear-market-query-kline",
  description: "Get kline.[reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-querykline)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    trigger_price_type: {
      propDefinition: [
        bybit,
        "trigger_price_type",
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
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = TRIGGER_PRICE_TYPES[this.trigger_price_type];
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this, [
      "trigger_price_type",
    ]);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get kline Successful");
    }
    return returnValue;
  },
};
