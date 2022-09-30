import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetBalance",
  version: "0.0.1",
  key: "bingx-account-get-balance",
  description: "Get Account Balance of BingX [here](https://bingx-api.github.io/docs/swap/account-api.html#_1-get-perpetual-swap-account-asset-information).",
  props: {
    bingx,
    currency: {
      label: "Currency",
      description: "Base Currency for which balance need to be retrieved",
      type: "string",
      default: "USDT",
      optional: true,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let balance = await this.bingx.getBalance(this.currency);
    console.log(balance);
    $.export("$summary", `Balance Retrieved for account currency \`${this.currency}\` for account \`${balance.data.account.userId}\``);
    return balance;
  },
};
