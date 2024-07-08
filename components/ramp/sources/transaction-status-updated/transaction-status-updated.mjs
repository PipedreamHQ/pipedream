import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-transaction-status-updated",
  name: "Transaction Status Updated",
  description: "Emits a new event when there is a change in transaction status.",
  version: "0.0.{{ts}}",
  type: "source",
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
    state: ramp.propDefinitions.state,
    department: ramp.propDefinitions.department,
    location: ramp.propDefinitions.location,
    merchant: ramp.propDefinitions.merchant,
  },
  methods: {
    _getAfter() {
      return this.db.get("after");
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      const transactions = await this.ramp.listTransactions(this, this.state, 50);
      for (const transaction of transactions) {
        this.$emit(transaction, {
          id: transaction.id,
          summary: `Transaction ${transaction.id} has status ${transaction.state}`,
          ts: Date.parse(transaction.created_at),
        });
      }
    },
  },
  async run() {
    const after = this._getAfter();
    const params = {
      state: this.state,
      department: this.department,
      location: this.location,
      merchant: this.merchant,
      after,
    };

    const transactions = await this.ramp.listTransactions(this, this.state, 50, after);
    if (transactions.length === 0) {
      console.log("No new transactions.");
      return;
    }

    for (const transaction of transactions) {
      if (this.department && transaction.department_id !== this.department) continue;
      if (this.location && transaction.location_id !== this.location) continue;
      if (this.merchant && transaction.merchant_id !== this.merchant) continue;

      this.$emit(transaction, {
        id: transaction.id,
        summary: `Transaction ${transaction.id} has status ${transaction.state}`,
        ts: Date.parse(transaction.created_at),
      });
    }

    const lastTransaction = transactions[transactions.length - 1];
    this._setAfter(lastTransaction
      ? lastTransaction.id
      : after);
  },
};
