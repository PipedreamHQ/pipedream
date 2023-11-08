import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import Flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-new-transaction",
  name: "New Transaction",
  description: "Emit new event when a new transaction is added.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flutterwave: {
      type: "app",
      app: "flutterwave",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLatestTransactionId() {
      return this.db.get("latestTransactionId") ?? 0;
    },
    _setLatestTransactionId(id) {
      this.db.set("latestTransactionId", id);
    },
  },
  hooks: {
    async deploy() {
      // Get most recent transactions
      const transactions = await this.flutterwave.getTransactions();
      if (transactions.data.length > 0) {
        // Store the ID of the most recent transaction
        this._setLatestTransactionId(transactions.data[0].id);
      }
    },
  },
  async run() {
    // Get the latest transaction ID we've seen
    const latestTransactionId = this._getLatestTransactionId();

    // Retrieve the latest transactions
    const transactions = await this.flutterwave.getTransactions();

    // Loop over each transaction
    for (const transaction of transactions.data) {
      // If we haven't seen this transaction before, emit it
      if (transaction.id > latestTransactionId) {
        this.$emit(transaction, {
          id: transaction.id,
          summary: `New transaction: ${transaction.tx_ref}`,
          ts: Date.parse(transaction.created_at),
        });
      }
    }

    // Store the ID of the latest transaction
    if (transactions.data.length > 0) {
      this._setLatestTransactionId(transactions.data[0].id);
    }
  },
};
