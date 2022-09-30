import bingx from "../../bingx.app.mjs";
import {
  KLINE_DESC_LIST, KLINE_DESC_MAPPING,
} from "../../bingx-common.mjs";

export default {
  name: "BingX Market GetHistoryKlines",
  version: "0.0.1",
  key: "bingx-market-get-kline-history",
  description: "K-Line Data History " +
        "[reference](https://bingx-api.github.io/docs/swap/market-api.html#_8-k-line-data-history).",
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
    klineType: {
      label: "K-Line Type",
      description: "The type of K-Line (minutes, hours, weeks etc.)",
      type: "string",
      options: KLINE_DESC_LIST,
      optional: false,
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
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getHistoryKlines(
      this.symbol,
      KLINE_DESC_MAPPING[this.klineType],
      this.startTime,
      this.endTime,
    );
    $.export("$summary", `K-Line Data History for Trading Pair ${this.symbol}`);
    return returnValue;
  },
};
