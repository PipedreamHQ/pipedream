import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetOpenPositions",
  version: "0.0.1",
  key: "bingx-market-get-open-positions",
  description: "Get Swap Open Positions [reference](https://bingx-api.github.io/docs/swap/market-api.html#_9-get-swap-open-positions).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getOpenPositions(this.symbol);
    $.export("$summary", `Open Positions of Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
