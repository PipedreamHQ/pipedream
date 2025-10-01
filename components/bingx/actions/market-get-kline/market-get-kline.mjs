import bingx from "../../bingx.app.mjs";
import { KLINE_DESC_MAPPING } from "../../common.mjs";

export default {
  name: "BingX Market Get Latest Kline",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-kline",
  description: "Get K-Line Data [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#%20K-Line%20Data).",
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
  async run({ $ }) {
    const returnValue = await this.bingx.getKline({
      params: {
        symbol: this.symbol,
        interval: KLINE_DESC_MAPPING[this.klineType],
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `K-Line Data for Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
