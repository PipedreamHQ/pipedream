import bingx from "../../bingx.app.mjs";
import { KLINE_DESC_MAPPING } from "../../bingx-common.mjs";

export default {
  name: "BingX Market GetLatestKline",
  version: "0.0.1",
  key: "bingx-market-get-kline",
  description: "Get K-Line Data " +
                "[reference](https://bingx-api.github.io/docs/swap/market-api.html#_7-get-k-line-data).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    klineType: {
      propDefinition: [
        bingx,
        "klineType",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getLatestKline(this.symbol,
      KLINE_DESC_MAPPING[this.klineType]);
    $.export("$summary", `K-Line Data for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
