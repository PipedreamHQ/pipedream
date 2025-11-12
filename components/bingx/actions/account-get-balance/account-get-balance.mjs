import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account Get Balance",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-account-get-balance",
  description: "Get Perpetual Swap Account Asset Information [See the documentation](https://bingx-api.github.io/docs/#/swapV2/account-api.html).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.getBalance({
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Balance Retrieved for account \`${returnValue.data.balance.userId}\``);
    }
    return returnValue;
  },
};
