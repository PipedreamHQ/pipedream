import jvzoo from "../../jvzoo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "jvzoo-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event when a new transaction is created. [See the documentation](https://api.jvzoo.com/docs/versions/v2.0.html#transactions-latest-transactions-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    jvzoo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getPaykey() {
      return this.db.get("paykey");
    },
    _setPaykey(paykey) {
      this.db.set("paykey", paykey);
    },
    generateMeta(transaction) {
      return {
        id: transaction.transaction_id,
        summary: `New transaction created: ${transaction.transaction_id}`,
        ts: Date.parse(transaction.date),
      };
    },
    async processEvent(max) {
      const paykey = this._getPaykey();
      const params = paykey
        ? {
          paykey,
        }
        : {};
      const { results } = await this.jvzoo.getLatestTransactions({
        params,
      });
      if (!results?.length) {
        return;
      }
      const transactions = max
        ? results.slice(max * -1)
        : results;
      for (const transaction of transactions) {
        this.$emit(transaction, this.generateMeta(transaction));
      }
      this._setPaykey(results[results.length - 1].transaction_id);
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
