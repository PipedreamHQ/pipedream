import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-category-overspent",
  // eslint-disable-next-line pipedream/source-name
  name: "Category Overspent",
  description: "Emit new event when a category budget is overspent",
  version: "0.0.4",
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
  },
  methods: {
    ...common.methods,
    generateMeta(balance, amount) {
      return {
        id: balance,
        summary: `Balance (${balance}) for ${this.getThisMonth()} dropped below ${amount}`,
      };
    },
  },
  async run() {
    const { category } = await this.app.getCategoryBudget({
      budgetId: this.budgetId,
      categoryId: this.categoryId.value,
    });

    const balance = this.app.convertFromMilliunit(category.balance);
    const budgeted = this.app.convertFromMilliunit(category.budgeted);

    if (balance < budgeted) {
      const meta = this.generateMeta(balance, budgeted);
      this.$emit(category, meta);
    }
  },
};
