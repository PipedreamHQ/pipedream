import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetPositions",
  version: "0.0.1",
  key: "bingx-account-get-positions",
  description: "Perpetual Swap Positions [reference](https://bingx-api.github.io/docs/swap/account-api.html#_2-perpetual-swap-positions).",
  props: {
    bingx,
    symbol: {
      label: "Symbol",
      description: "Symbol/Ticker/Trading Pair. There must be a hyphen/ \"-\" in the trading pair symbol. eg: BTC-USDT",
      type: "string",
      optional: false,
      default: "BTC-USDT",
      async options() {
        const contractsData = await this.bingx.getAllMarketContracts();
        return contractsData.data.contracts.map((contract) => contract.symbol);
      },
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getPositions(this.symbol);
    $.export("$summary", `Positions retrieved for symbol \`${this.symbol}\``);
    return returnValue;
  },
};
