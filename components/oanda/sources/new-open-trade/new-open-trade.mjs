import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oanda-new-open-trade",
  name: "New Open Trade",
  description: "Emit new event when a new trade is opened in an Oanda account. [See the documentation](https://developer.oanda.com/rest-live-v20/trade-ep/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent(max) {
      const lastId = this._getLastId();
      let count = 0;

      const {
        trades, lastTransactionID,
      } = await this.oanda.listOpenTrades({
        isDemo: this.isDemo,
        accountId: this.accountId,
      });

      if (!trades.length) {
        return;
      }

      const newTrades = trades.filter(({ id }) => id > lastId);

      for (const trade of newTrades.reverse()) {
        this.emitItem(trade);
        count++;
        if (max && count >= max) {
          break;
        }
      }

      this._setLastId(lastTransactionID);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Open Trade with ID: ${item.id}`,
        ts: Date.parse(item.openTime),
      };
    },
  },
  sampleEmit,
};
