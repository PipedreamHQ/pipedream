import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetBalance",
  version: "0.0.3",
  key: "account-get-balance",
  description: "Get Perpetual Swap Account Asset Information [reference](https://bingx-api.github.io/docs/swap/account-api.html#_1-get-perpetual-swap-account-asset-information).",
  props: {
    bingx,
    currency: {
      propDefinition: [
        bingx,
        "currency",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/getBalance";
    const parameters = {
      "currency": this.currency,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Balance Retrieved for account currency \`${this.currency}\` for account \`${returnValue.data.account.userId}\``);
    }
    return returnValue;
  },
};
