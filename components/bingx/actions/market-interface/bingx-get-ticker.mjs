import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetTicker",
  version: "0.0.1",
  key: "bingx-market-get-ticker",
  description: "Get Ticker [reference](https://bingx-api.github.io/docs/swap/market-api.html#_10-get-ticker).",
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
    let returnValue = await this.bingx.getTicker(this.symbol);
    $.export("$summary", `Ticker Information for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
