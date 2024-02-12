import mxTechnologies from "../../mx_technologies.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mx_technologies-new-data-update-completed",
  name: "New Data Update Completed",
  description: "Emits an event when a syncing process finishes, indicating that new financial data is available.",
  version: "0.0.{{ts}}",
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
    userId: mxTechnologies.propDefinitions.userId,
    memberId: mxTechnologies.propDefinitions.memberId,
    accountId: mxTechnologies.propDefinitions.accountId,
  },
  methods: {
    ...mxTechnologies.methods,
    getEmitTimestamp(transaction) {
      return new Date(transaction.created_at).getTime();
    },
  },
  async run() {
    const lastProcessedTimestamp = this.db.get("lastProcessedTimestamp") || 0;
    const { transactions } = await this.mxTechnologies.listManagedTransactions({
      userGuid: this.userId,
      memberGuid: this.memberId,
      accountGuid: this.accountId,
    });

    const newTransactions = transactions.filter((transaction) => Date.parse(transaction.created_at) > lastProcessedTimestamp);

    let latestTimestamp = lastProcessedTimestamp;
    for (const transaction of newTransactions) {
      const emitTimestamp = this.getEmitTimestamp(transaction);
      this.$emit(transaction, {
        id: transaction.guid,
        summary: `Transaction: ${transaction.amount} ${transaction.currency_code} - ${transaction.description}`,
        ts: emitTimestamp,
      });
      if (emitTimestamp > latestTimestamp) {
        latestTimestamp = emitTimestamp;
      }
    }

    this.db.set("lastProcessedTimestamp", latestTimestamp);
  },
};
