import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetBalance",
  version: "0.0.1",
  key: "bingx-account-get-balance",
  description: "Get Perpetual Swap Account Asset Information [reference](https://bingx-api.github.io/docs/swap/account-api.html#_1-get-perpetual-swap-account-asset-information).",
  props: {
    bingx,
    currency: {
      label: "Currency",
      description: "Account Asset",
      type: "string",
      default: "USDT",
      optional: true,
      async options() {
        const contractsData = await this.bingx.getAllMarketContracts();
        return contractsData.data.contracts.map((contract) => contract.currency);
      },
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getBalance(this.currency);
    $.export("$summary", `Balance Retrieved for account currency \`${this.currency}\` for account \`${returnValue.data.account.userId}\``);
    return returnValue;
  },
};
