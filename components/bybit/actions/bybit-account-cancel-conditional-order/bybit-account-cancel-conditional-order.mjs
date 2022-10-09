import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Cancel Conditional Order",
  version: "0.0.1",
  key: "bybit-account-cancel-conditional-order",
  description: "Cancel Conditional Order." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-cancelcond)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
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
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/stop-order/cancel";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Conditional Order Cancel Successful");
    }
    return returnValue;
  },
};
