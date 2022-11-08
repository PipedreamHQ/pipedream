import common from "../common.mjs";

export default {
  ...common,
  key: "coinbase-new-transactions",
  name: "New Transactions",
  description: "New Transactions. [See the docs here](https://developers.coinbase.com/api/v2#transaction-resource)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    ...common.methods,
    getMetadata(transaction) {
      const {
        id,
        created_at: createdAt,
      } = transaction;
      const summary = `Transaction ${id}`;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run({ $ }) {
    let lastTransactionId = this._getLastTransactionId();
    let totalTransactions;

    do {
      const { data: transactions } =
        await this.coinbase.getTransactions({
          $,
          accountId: this.accountId,
          limit: 25,
          startingAfter: lastTransactionId,
        });

      totalTransactions = transactions.length;
      if (totalTransactions) {
        const [
          lastTransaction,
        ] = transactions.slice(-1);
        lastTransactionId = lastTransaction.id;
      }

      transactions.forEach((transaction) => {
        this.$emit(transaction, this.getMetadata(transaction));
      });

    } while (totalTransactions);

    this._setLastTransactionId(lastTransactionId);
  },
};
