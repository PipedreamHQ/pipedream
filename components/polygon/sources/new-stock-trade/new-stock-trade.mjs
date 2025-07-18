import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "polygon-new-stock-trade",
  name: "New Stock Trade",
  description: "Emit new event when a trade occurs for a specified stock ticker.",
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
    adjusted: {
      propDefinition: [
        common.props.app,
        "adjusted",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.getPreviousClose;
    },
    getSummary() {
      return `New trade for ${this.stockTicker}`;
    },
    getData() {
      return {
        stockTicker: this.stockTicker,
        adjusted: this.adjusted,
      };
    },
    parseData({ results }) {
      return {
        parsedData: results,
        nextPage: null,
      };
    },
  },
  sampleEmit,
};
