import ramp from "../../ramp.app.mjs";
import common from "../../sources/common/common.mjs";

export default {
  type: "source",
  key: "ramp-new-transaction-created",
  name: "New Transaction Created",
  description: "Emits an event for each new transaction created in Ramp.",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    ramp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    state: {
      ...ramp.propDefinitions.state,
      description: "The state of the transaction to watch for",
      optional: false,
    },
    department: ramp.propDefinitions.department,
    location: ramp.propDefinitions.location,
    merchant: ramp.propDefinitions.merchant,
  },
  methods: {
    ...ramp.methods,
    _getLatestTransactionId() {
      return this.db.get("latestTransactionId");
    },
    _setLatestTransactionId(id) {
      this.db.set("latestTransactionId", id);
    },
  },
  hooks: {
    async deploy() {
      const transactions = await this.ramp.listTransactions(this, this.state, common.defaultPageSize);
      if (transactions.length > 0) {
        const latestTransaction = transactions[0];
        this._setLatestTransactionId(latestTransaction.id);
      }
    },
  },
  async run() {
    const latestTransactionId = this._getLatestTransactionId();
    const transactions = await this.ramp.listTransactions(this, this.state, common.defaultPageSize, latestTransactionId);
    for (const transaction of transactions) {
      if (
        (!this.department || transaction.department === this.department) &&
        (!this.location || transaction.location === this.location) &&
        (!this.merchant || transaction.merchant === this.merchant)
      ) {
        this.$emit(transaction, {
          id: transaction.id,
          summary: `New transaction from ${transaction.merchant}`,
          ts: Date.parse(transaction.created_at),
        });

        if (!latestTransactionId || transaction.id > latestTransactionId) {
          this._setLatestTransactionId(transaction.id);
        }
      }
    }
  },
};
