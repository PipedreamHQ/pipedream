import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Linear Order List",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-linear-order-list",
  description: "List of active orders." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-getactive)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
      ],
    },
    order_status: {
      propDefinition: [
        bybit,
        "order_status",
      ],
    },
    order_id: {
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
    const API_PATH = "/private/linear/order/list";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Active Orders Fetched Successfully");
    }
    return returnValue;
  },
};
