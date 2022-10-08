import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Wallet Get Balance",
  version: "0.0.1",
  key: "bybit-wallet-get-balance",
  description: "Get Wallet Balance.[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-balance)",
  props: {
    bybit,
    coin: {
      propDefinition: [
        bybit,
        "coin",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/v2/private/wallet/balance";
    let returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get Balance Info Successful");
    }
    return returnValue;
  },
};
