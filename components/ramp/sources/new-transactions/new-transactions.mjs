import ramp from "../../ramp.app.mjs";
import common from "../common/common.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "ramp-new-transactions",
  name: "New Transactions",
  description: "Emit new transaction by retrieving all transactions of the business. [See Docs](https://docs.ramp.com/reference/rest/transactions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ramp,
    state: {
      type: "string",
      label: "State",
      description: "Filter transactions by its current state",
      options: common.stateOptions,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLatestTransactionId(id) {
      this.db.set("latest-transaction-id", id);
    },
    getLatestTransactionId() {
      return this.db.get("latest-transaction-id");
    },
  },
  async run({ $ }) {
    const latestTransactionId = this.getLatestTransactionId();
    const transactions = await this.ramp.listTransactions(
      $,
      this.state,
      common.defaultPageSize,
      latestTransactionId,
    );
    transactions.data.forEach((transaction) => {
      this.$emit(transaction, {
        id: transaction.id,
        summary: `Transaction of $${transaction.amount} on ${transaction.merchant_name}`,
        ts: transaction.user_transaction_time && +new Date(transaction.user_transaction_time),
      });
      this.setLatestTransactionId(transaction.id);
    });
  },
};
