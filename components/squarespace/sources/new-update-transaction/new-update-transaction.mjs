import squarespace from "../../squarespace.app.mjs";

export default {
  name: "New Update Transaction",
  version: "0.0.1",
  key: "squarespace-new-update-transaction",
  description: "Emit new event for each transaction updated.",
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
        id: `transaction.id - ${Date.parse(transaction.modifiedOn)}`,
        summary: `New transaction ${transaction.id} updated`,
        ts: Date.parse(transaction.modifiedOn),
      });
    }
  },
};
