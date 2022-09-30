import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetMarketTrades",
  version: "0.0.1",
  key: "bingx-market-get-market-trades",
  description: "The latest Trade of a Trading Pair [reference](https://bingx-api.github.io/docs/swap/market-api.html#_4-the-latest-trade-of-a-trading-pair).",
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
    let returnValue = await this.bingx.getMarketTrades(this.symbol);
    $.export("$summary", `Latest Trade of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
