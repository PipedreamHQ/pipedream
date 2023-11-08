import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-new-transfer",
  name: "New Transfer",
  description: "Emit new event whenever a new transfer event occurs.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flutterwave,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTransferDate() {
      return this.db.get("lastTransferDate");
    },
    _setLastTransferDate(date) {
      this.db.set("lastTransferDate", date);
    },
    _isTransferNew(transfer) {
      const lastTransferDate = this._getLastTransferDate();
      return Date.parse(transfer.created_at) > Date.parse(lastTransferDate);
    },
  },
  hooks: {
    async deploy() {
      const transactions = await this.flutterwave.getTransactions();
      if (transactions.data.length > 0) {
        const lastTransferDate = transactions.data[0].created_at;
        this._setLastTransferDate(lastTransferDate);
      }
    },
  },
  async run() {
    const transactions = await this.flutterwave.getTransactions();
    for (const transaction of transactions.data) {
      if (this._isTransferNew(transaction)) {
        this.$emit(transaction, {
          id: transaction.id,
          summary: `New Transfer: ${transaction.tx_ref}`,
          ts: Date.parse(transaction.created_at),
        });
        this._setLastTransferDate(transaction.created_at);
      }
    }
  },
};
