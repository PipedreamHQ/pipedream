import common from "../common/common.mjs";

export default {
  ...common,
  key: "you_need_a_budget-low-category-balance",
  // eslint-disable-next-line pipedream/source-name
  name: "Low Category Balance",
  description: "Emit new event when a category balance drops below a certain amount",
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
        summary: `Balance (${balance}) for ${this.getThisMonth()} dropped below ${amount}`,
      };
    },
  },
  async run() {
    const { category } = await this.app.getCategoryBudget({
      budgetId: this.budgetId,
      categoryId: this.categoryId.value,
    });

    // guarantee correct value is used
    const amount = this.app.convertFromMilliunit(this.app._convertToMilliunit(this.amount));
    const balance = this.app.convertFromMilliunit(category.balance);

    if (balance < amount) {
      const meta = this.generateMeta(balance, amount);
      this.$emit(category, meta);
    }
  },
};
