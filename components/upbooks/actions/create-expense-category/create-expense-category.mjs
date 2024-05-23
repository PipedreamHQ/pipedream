import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-create-expense-category",
  name: "Create Expense Category",
  description: "Creates a new expense category in UpBooks.",
  version: "0.0.1",
  type: "action",
  props: {
    upbooks,
    categoryName: {
      propDefinition: [
        upbooks,
        "categoryName",
      ],
    },
    description: {
      propDefinition: [
        upbooks,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.upbooks.createExpenseCategory({
      categoryName: this.categoryName,
      description: this.description,
    });
    $.export("$summary", `Successfully created new expense category: ${this.categoryName}`);
    return response;
  },
};
