import sumup from "../../sumup.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "sumup-new-transaction",
  name: "New Transaction",
  description: "Emit new event when a new transaction is posted in SumUp. [See the documentation](https://developer.sumup.com/api/transactions/list-detailed)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    sumup,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    statuses: {
      propDefinition: [
        sumup,
        "statuses",
      ],
    },
    paymentTypes: {
      propDefinition: [
        sumup,
        "paymentTypes",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || this.oneDayAgo();
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    oneDayAgo() {
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        .slice(0, 19) + "Z";
    },
    generateMeta(transaction) {
      return {
        id: transaction.id,
        summary: `New Transaction ${transaction.id}`,
        ts: Date.parse(transaction.timestamp),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const { items } = await this.sumup.listTransactions({
      params: {
        statuses: this.statuses,
        payment_types: this.paymentTypes,
        oldest_time: lastTs,
      },
    });
    for (const item of items) {
      if (Date.parse(item.timestamp) > Date.parse(maxTs)) {
        maxTs = item.timestamp;
      }
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
