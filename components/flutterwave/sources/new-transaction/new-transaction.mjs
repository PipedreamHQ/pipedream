import base from "../common/base.mjs";

export default {
  ...base,
  key: "flutterwave-new-transaction",
  name: "New Transaction",
  description: "Emit new event when a new transaction is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.flutterwave.getTransactions;
    },
    getParams(lastTs) {
      return lastTs
        ? {
          from: this.formatDate(lastTs),
        }
        : {};
    },
    generateMeta(transaction) {
      return {
        id: transaction.id,
        summary: `New transaction: ${transaction.tx_ref}`,
        ts: Date.parse(transaction.created_at),
      };
    },
  },
};
