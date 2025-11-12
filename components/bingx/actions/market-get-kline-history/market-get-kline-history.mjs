import bingx from "../../bingx.app.mjs";
import { KLINE_DESC_MAPPING } from "../../common.mjs";

export default {
  name: "BingX Market Get History Klines",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-kline-history",
  description: "K-Line Data History [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#%20K-Line%20Data).",
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
    startTime: {
      label: "Start Timestamp",
      description: "Start timestamp, Unit: ms",
      type: "integer",
      optional: false,
    },
    endTime: {
      label: "End Timestamp",
      description: "End timestamp, Unit: ms",
      type: "integer",
      optional: false,
    },
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.getKline({
      params: {
        symbol: this.symbol,
        interval: KLINE_DESC_MAPPING[this.klineType],
        startTime: this.startTime,
        endTime: this.endTime,
      },
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `K-Line Data History for Trading Pair ${this.symbol}`);
    }
    return returnValue;
  },
};
