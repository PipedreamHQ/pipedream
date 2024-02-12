import mxTechnologies from "../../mx_technologies.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mx_technologies-new-transaction-posted",
  name: "New Transaction Posted",
  description: "Emits an event for each new transaction posted to a user's account. [See the documentation](https://docs.mx.com/api-reference/platform-api/reference/list-transactions-by-account)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    mxTechnologies,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    accountId: {
      propDefinition: [
        mxTechnologies,
        "accountId",
      ],
    },
    userId: {
      propDefinition: [
        mxTechnologies,
        "userId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Set the initial state for pagination
      this.db.set("since", new Date().toISOString());
    },
  },
  methods: {
    generateMeta(transaction) {
      return {
        id: transaction.guid,
        summary: `New Transaction: $${transaction.amount} - ${transaction.description}`,
        ts: Date.parse(transaction.created_at),
      };
    },
  },
  async run() {
    const since = this.db.get("since");
    const transactions = await this.mxTechnologies.listTransactionsByAccount({
      userGuid: this.userId,
      accountGuid: this.accountId,
    });

    transactions.forEach((transaction) => {
      if (new Date(transaction.created_at) > new Date(since)) {
        const meta = this.generateMeta(transaction);
        this.$emit(transaction, meta);
      }
    });

    // Update the since time to the current time
    this.db.set("since", new Date().toISOString());
  },
};
