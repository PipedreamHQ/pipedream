import squarespace from "../../squarespace.app.mjs";

export default {
  name: "New Create Transaction",
  version: "0.0.1",
  key: "squarespace-new-create-transaction",
  description: "Emit new event for each transaction created.",
  type: "source",
  dedupe: "unique",
  props: {
    squarespace,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  async run() {
    const transactions = await this.squarespace.getTransactions();

    for (const transaction of transactions) {
      this.$emit(transaction, {
        id: transaction.id,
        summary: `New transaction ${transaction.id} created`,
        ts: Date.parse(transaction.createdOn),
      });
    }
  },
};
