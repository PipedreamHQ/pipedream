import bingx from "../bingx.app.mjs";

export default {
  name: "BingX GetBalance",
  version: "0.0.1",
  key: "bingx-get-balance",
  description: "Get Account Balance of BingX [here](https://bingx-api.github.io/docs/swap/account-api.html#_1-get-perpetual-swap-account-asset-information).",
  props: {
    bingx,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let balance = await this.bingx.getBalance();
    console.log(balance);
    $.export("$summary", `Balance Retrieved for account \`${balance.data.account.userId}\``);
    return balance;
  },
};
