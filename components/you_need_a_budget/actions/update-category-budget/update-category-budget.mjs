import app from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-update-category-budget",
  name: "Update Category Budget",
  description: "Update a category budget for a specific month. [See the docs](https://api.youneedabudget.com/v1#/Categories/updateMonthCategory)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    budgetId: {
      propDefinition: [
        app,
        "budgetId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
        (c) => ({
          budgetId: c.budgetId,
        }),
      ],
    },
    budget: {
      propDefinition: [
        app,
        "amount",
      ],
      label: "Budget",
    },
    month: {
      propDefinition: [
        app,
        "month",
        (c) => ({
          budgetId: c.budgetId,
        }),
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.updateCategoryBudget({
        budgetId: this.budgetId,
        categoryId: this.categoryId.value,
        month: this.month,
        budget: this.budget,
      });
      $.export("$summary", `${this.categoryId.label} budget updated to ${this.budget}`);
      return response;
    } catch (error) {
      if (error.error) {
        this.app.throwFormattedError(error.error);
      }
      this.app.throwFormattedError(error);
    }
  },
};
