import bingx from "../../bingx.app.mjs";
import { KLINE_DESC_MAPPING } from "../../common.mjs";

export default {
  name: "BingX Market GetLatestKline",
  version: "0.0.2",
  key: "market-get-kline",
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
    const API_METHOD = "GET";
    const API_PATH = "/api/v1/market/getLatestKline";
    const parameters = {
      "symbol": this.symbol,
      "klineType": KLINE_DESC_MAPPING[this.klineType],
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `K-Line Data for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
