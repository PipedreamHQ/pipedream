import nordigen from "../../nordigen.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "nordigen-new-transaction",
  name: "New Transaction",
  description: "Emit new event when a transaction occurs",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    nordigen,
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "When should the source check for a new event",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    requisitionId: {
      propDefinition: [
        nordigen,
        "requisitionId",
      ],
    },
    accountId: {
      propDefinition: [
        nordigen,
        "accountId",
        (c) => ({
          requisitionId: c.requisitionId,
        }),
      ],
    },
  },
  methods: {
    _getLastTransactionDate() {
      return this.db.get("lastTransactionDate");
    },
    _setLastTransactionDate(lastTransactionDate) {
      this.db.set("lastTransactionDate", lastTransactionDate);
    },
  },
  async run() {
    let lastTransactionDate = this._getLastTransactionDate();
    const args = lastTransactionDate
      ? {
        params: {
          date_from: lastTransactionDate,
        },
      }
      : {};
    const transactions = await this.nordigen.listTransactions(this.accountId, args);

    transactions.forEach((transaction) => {
      if (!lastTransactionDate
        || Date.parse(transaction.bookingDate) > Date.parse(lastTransactionDate)) {
        lastTransactionDate = transaction.bookingDate;
      }
      this.$emit(transaction, {
        summary: `${transaction.transactionAmount.amount} ${transaction.transactionAmount.currency} - ${transaction.valueDate}`,
        id: transaction.transactionId,
        ts: new Date(),
      });
    });

    this._setLastTransactionDate(lastTransactionDate);
  },
};
