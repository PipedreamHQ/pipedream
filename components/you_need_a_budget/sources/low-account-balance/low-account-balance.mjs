import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-low-account-balance",
  // eslint-disable-next-line pipedream/source-name
  name: "Low Account Balance",
  description: "Emit new event when an account balance drops below a certain amount",
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
    amount: {
      propDefinition: [
        common.props.app,
        "amount",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(balance, amount) {
      return {
        id: balance,
        summary: `Balance (${balance}) dropped below ${amount}`,
      };
    },
  },
  async run() {
    const { account } = await this.app.getAccount({
      budgetId: this.budgetId,
      accountId: this.accountId,
    });

    // guarantee correct value is used
    const amount = this.app.convertFromMilliunit(this.app._convertToMilliunit(this.amount));
    const balance = this.app.convertFromMilliunit(account.balance);

    if (balance < amount) {
      const meta = this.generateMeta(balance, amount);
      this.$emit(account, meta);
    }
  },
};
