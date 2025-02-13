import { parseNextPage } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "polygon-new-stock-price-summary",
  name: "New Stock Price Summary",
  description: "Emit new event when the daily price summary (open, high, low, close) for a specified stock ticker is available.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    stockTicker: {
      propDefinition: [
        common.props.app,
        "stockTicker",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.getTradeEvents;
    },
    getSummary() {
      return `Daily price summary for ${this.stockTicker}`;
    },
    getData(lastDate) {
      return {
        stockTicker: this.stockTicker,
        params: {
          "limit": 5000,
          "sort": "timestamp",
          "order": "desc",
          "timestamp.gt": lastDate,
        },
      };
    },
    parseData({
      results, next_url: next,
    }) {
      const parsedPage = parseNextPage(next);

      return {
        parsedData: results,
        nextPage: parsedPage,
      };
    },
  },
  sampleEmit,
};

