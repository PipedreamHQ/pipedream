import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Account Cancel All Active Orders",
  version: "0.0.1",
  key: "bybit-account-cancel-all-active-orders",
  description: "Cancel All Active Orders." +
      " [reference](https://bybit-exchange.github.io/docs/futuresV2/linear/#t-cancelallactive)",
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
    const API_METHOD = "POST";
    const API_PATH = "/private/linear/order/cancel-all";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Active Orders Cancelled Successfully");
    }
    return returnValue;
  },
};
