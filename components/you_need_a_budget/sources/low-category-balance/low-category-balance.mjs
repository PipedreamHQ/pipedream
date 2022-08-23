import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-low-category-balance",
  // eslint-disable-next-line pipedream/source-name
  name: "Low Category Balance",
  description: "Emit new event when a category balance drops below a certain amount during a month",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    categoryId: {
      propDefinition: [
        common.props.app,
        "categoryId",
        (c) => ({
          budgetId: c.budgetId,
        }),
      ],
    },
    month: {
      propDefinition: [
        common.props.app,
        "month",
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
    generateMeta(balance, month, amount) {
      return {
        id: balance,
        summary: `Balance - ${balance} - for ${month} dropped below ${amount}`,
      };
    },
  },
  async run() {
    const { month: budget } = await this.app.getBudget({
      budgetId: this.budgetId,
      month: this.month,
    });

    const [
      category,
    ] = budget.categories.filter((category) => category.id === this.categoryId.value);

    // guarantee correct value is used
    const amount = this.app.convertFromMilliunit(this.app._convertToMilliunit(this.amount));
    const balance = this.app.convertFromMilliunit(category.balance);
    if (balance < amount) {
      const meta = this.generateMeta(balance, budget.month, amount);
      this.$emit(category, meta);
    }
  },
};
