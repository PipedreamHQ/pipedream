import bingx from "../../bingx.app.mjs";
import { KLINE_DESC_MAPPING } from "../../common.mjs";

export default {
  name: "BingX Market Get History Klines",
  version: "0.0.3",
  key: "bingx-market-get-kline-history",
  description: "K-Line Data History [reference](https://bingx-api.github.io/docs/swap/market-api.html#_8-k-line-data-history).",
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
    const API_METHOD = "GET";
    const API_PATH = "/api/v1/market/getHistoryKlines";
    const parameters = {
      "symbol": this.symbol,
      "klineType": KLINE_DESC_MAPPING[this.klineType],
      "startTs": this.startTime,
      "endTs": this.endTime,
    };
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `K-Line Data History for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
