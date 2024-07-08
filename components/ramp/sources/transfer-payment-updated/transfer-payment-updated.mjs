import { axios } from "@pipedream/platform";
import ramp from "../../ramp.app.mjs";

export default {
  type: "source",
  key: "ramp-transfer-payment-updated",
  name: "Transfer Payment Updated",
  description: "Emits an event when the status of a transfer payment changes",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ramp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    state: {
      propDefinition: [
        ramp,
        "state",
      ],
    },
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
      const latestTransaction = await this.ramp.listTransactions(
        this,
        this.state,
        1,
      );
      if (latestTransaction.length > 0) {
        this._setLatestTransactionId(latestTransaction[0].id);
      }
    },
  },
  async run() {
    const latestTransactionId = this._getLatestTransactionId();
    const transactions = await this.ramp.listTransactions(
      this,
      this.state,
      50,
      latestTransactionId,
    );
    for (const transaction of transactions) {
      this.$emit(transaction, {
        id: transaction.id,
        summary: `Transfer payment with ID ${transaction.id} has been updated`,
        ts: Date.parse(transaction.created_at),
      });
    }
    const newLatestTransactionId = transactions[transactions.length - 1]?.id;
    this._setLatestTransactionId(newLatestTransactionId);
  },
};
