import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Stop Order List",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bybit-linear-stop-order-list",
  description: "List of conditional orders." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-getcond)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    stop_order_status: {
      propDefinition: [
        bybit,
        "stop_order_status",
      ],
    },
    stop_order_id: {
      propDefinition: [
        bybit,
        "order_id",
      ],
    },
    order_link_id: {
      propDefinition: [
        bybit,
        "order_link_id",
      ],
    },
    order: {
      propDefinition: [
        bybit,
        "order",
      ],
    },
    page: {
      propDefinition: [
        bybit,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        bybit,
        "limit",
      ],
      description: "Limit for data size per page, max size is 50. Default as showing 20 pieces of data per page",
      max: 50,
    },
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/private/linear/stop-order/list";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Conditional Orders Fetched Successfully");
    }
    return returnValue;
  },
};
