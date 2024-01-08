import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-new-or-updated-transaction",
  name: "New or Updated Transaction",
  description: "Emit new event for every new or updated transaction. [See the docs](https://api.youneedabudget.com/v1#/Transactions/getTransactions)",
  version: "0.0.4",
  type: "source",
  props: {
    ...common.props,
    budgetId: {
      propDefinition: [
        common.props.app,
        "budgetId",
      ],
      withLabel: true,
    },
    sinceDate: {
      propDefinition: [
        common.props.app,
        "date",
      ],
      label: "Since Date",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    generateMeta(event, isUpdate = false) {
      const {
        id,
        date,
        amount,
      } = event;
      const spent = this.app.convertFromMilliunit(amount);
      const ts = Date.parse(date);
      const summary = isUpdate
        ? `Updated transaction in ${this.budgetId.label}: ${spent}`
        : `New transaction in ${this.budgetId.label}: ${spent}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const lastKnowledgeOfServer = this.getLastKnowledgeOfServer();
    const emittedTransactions = this.getEmittedTransactions();

    const {
      server_knowledge: serverKnowledge,
      transactions = [],
    } = await this.app.getTransactions({
      budgetId: this.budgetId.value,
      sinceDate: this.sinceDate || undefined,
      lastKnowledgeOfServer,
    });

    this.setLastKnowledgeOfServer(serverKnowledge);

    for (const transaction of transactions) {
      let isUpdate;
      if (emittedTransactions[transaction.id]) {
        isUpdate = true;
      } else {
        emittedTransactions[transaction.id] = true;
      }
      const meta = this.generateMeta(transaction, isUpdate);
      this.$emit(transaction, meta);
    }

    this.setEmittedTransactions(emittedTransactions);
  },
};
