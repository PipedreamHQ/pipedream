import common from "../common/base.mjs";

export default {
  ...common,
  key: "clear_books-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event when a new transaction is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFn() {
      return this.clearBooks.listTransactions;
    },
    generateMeta(transaction) {
      return {
        id: transaction.id,
        summary: `New Transaction with ID: ${transaction.id}`,
        ts: Date.now(),
      };
    },
  },
};
