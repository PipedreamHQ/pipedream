import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Get Active Orders",
  version: "0.0.1",
  key: "bybit-account-get-active-orders",
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
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/private/linear/order/list";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Active Order Fetched Successfully");
    }
    return returnValue;
  },
};
