const mercury = require("../../mercury.app.js");

module.exports = {
  key: "mercury-new-transaction",
  name: "New Transaction",
  description: "Emits an event for each new transaction in an account.",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  props: {
    mercury,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    account: {
      propDefinition: [
        mercury,
        "account",
      ],
    },
  },
  methods: {
    getMeta(transaction) {
      const {
        id, counterpartyName: summary, postedAt,
      } = transaction;
      const ts = new Date(postedAt).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime")
      ? new Date(this.db.get("lastRunTime"))
      : this.mercury.daysAgo(1);
    const params = {
      limit: 100,
      offset: 0,
      start: lastRunTime.toISOString().split("T")[0],
    };
    let totalTransactions = params.limit;
    while (totalTransactions == params.limit) {
      const results = await this.mercury.getTransactions(this.account, params);
      const { transactions } = results;
      totalTransactions = transactions.length;
      for (const transaction of transactions) {
        this.$emit(transaction, this.getMeta(transaction));
      }
      params.offset += params.limit;
    }
    this.db.set("lastRunTime", new Date());
  },
};
