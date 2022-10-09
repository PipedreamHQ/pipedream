import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Cancel Active Order",
  version: "0.0.1",
  key: "bybit-account-cancel-active-order",
  description: "Cancel Active Order. [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-cancelactive)",
  props: {
    bybit,
    symbol: {
      propDefinition: [
        bybit,
        "symbol",
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
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/order/cancel";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Active Order Cancelled Successfully");
    }
    return returnValue;
  },
};
