import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-category-overspent",
  // eslint-disable-next-line pipedream/source-name
  name: "Category Overspent",
  description: "Emit new event when a category budget is overspent",
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

    const balance = this.app.convertFromMilliunit(category.balance);
    const budgeted = this.app.convertFromMilliunit(category.budgeted);
    if (balance < budgeted) {
      const meta = this.generateMeta(balance, budget.month, budgeted);
      this.$emit(category, meta);
    }
  },
};
