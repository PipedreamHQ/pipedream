import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetLatestPrice",
  version: "0.0.1",
  key: "bingx-market-get-latest-price",
  description: "Get Latest Price of a Trading Pair [reference](https://bingx-api.github.io/docs/swap/market-api.html#_2-get-latest-price-of-a-trading-pair).",
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
    let returnValue = await this.bingx.getLatestPrice(this.symbol);
    $.export("$summary", `Latest Price of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
