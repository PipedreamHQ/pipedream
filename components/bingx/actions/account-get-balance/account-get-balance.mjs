import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account Get Balance",
  version: "0.0.5",
  key: "bingx-account-get-balance",
  description: "Get Perpetual Swap Account Asset Information [See the documentation](https://bingx-api.github.io/docs/#/swapV2/account-api.html).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/user/balance";
    const parameters = {};
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Balance Retrieved for account \`${returnValue.data.balance.userId}\``);
    }
    return returnValue;
  },
};
