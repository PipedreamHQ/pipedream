import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-new-spending-in-account",
  name: "New Spending In Account",
  description: "Emit new event for every spending in an account. [See the docs](https://api.youneedabudget.com/v1#/Transactions/getTransactionsByAccount)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    accountId: {
      propDefinition: [
        common.props.app,
        "accountId",
        (c) => ({
          budgetId: c.budgetId,
        }),
      ],
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
    generateMeta(event) {
      const {
        id,
        date,
        amount,
        account_name: account,
      } = event;
      const spent = this.app.convertFromMilliunit(amount);
      return {
        id,
        summary: `New transaction in ${account} account: ${spent}`,
        ts: Date.parse(date),
      };
    },
  },
  async run() {
    const lastKnowledgeOfServer = this.getLastKnowledgeOfServer();
    const {
      server_knowledge: serverKnowledge,
      transactions = [],
    } = await this.app.getTransactionsByAccount({
      budgetId: this.budgetId,
      accountId: this.accountId,
      sinceDate: this.sinceDate || undefined,
      lastKnowledgeOfServer,
    });
    this.setLastKnowledgeOfServer(serverKnowledge);
    for (const transaction of transactions) {
      const meta = this.generateMeta(transaction);
      this.$emit(transaction, meta);
    }
  },
};
