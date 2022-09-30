import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market getHistoryFunding",
  version: "0.0.1",
  key: "bingx-market-get-historical-funding",
  description: "Funding Rate History [reference](https://bingx-api.github.io/docs/swap/market-api.html#_6-funding-rate-history).",
  props: {
    bingx,
    symbol: {
      label: "Symbol",
      description: "Symbol/Ticker/Trading Pair. There must be a hyphen/ \"-\" in the trading pair symbol. eg: BTC-USDT",
      type: "string",
      optional: false,
      default: "BTC-USDT",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getHistoryFunding(this.symbol);
    $.export("$summary", `Historical Funding Rate for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
