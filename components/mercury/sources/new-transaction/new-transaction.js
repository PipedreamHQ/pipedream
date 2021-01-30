const mercury = require("../../mercury.app.js");

module.exports = {
  key: "mercury-new-transaction",
  name: "New Transaction",
  description: "Emits an event for each new transaction in an account.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    mercury,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    account: {
      type: "string",
      label: "Account",
      optional: false,
      async options() {
        const results = await this.mercury.getAccounts();
        const options = results.map((result) => {
          const { name, id } = result;
          return { label: name, value: id };
        });
        return options;
      },
    },
  },
  methods: {
    getMeta(transaction) {
      const { id, counterpartyName, postedAt } = transaction;
      const postedAtDate = new Date(postedAt);
      const ts = postedAtDate.getTime();
      const summary = counterpartyName;
      return { id, summary, ts };
    },
  },
  async run(event) {
    const lastRunTime =
      new Date(this.db.get("lastRunTime")) || this.mercury.dayAgo();
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