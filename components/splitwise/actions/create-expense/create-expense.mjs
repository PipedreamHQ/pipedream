import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-create-expense",
  name: "Create Expense",
  description: "Creates a new expense. [See docs here](https://dev.splitwise.com/#tag/expenses/paths/~1create_expense/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    splitwise,
    cost: {
      type: "string",
      label: "Cost",
      description: "A string representation of a decimal value, limited to 2 decimal places.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short description of the expense.",
    },
    details: {
      type: "string",
      label: "Details",
      description: "Also known as **notes**.",
      optional: true,
    },
    group: {
      propDefinition: [
        splitwise,
        "group",
      ],
      description: "The group to put this expense in.",
    },
  },
  async run({ $ }) {
    const expense = await this.splitwise.createExpense({
      $,
      params: {
        cost: this.cost,
        description: this.description,
        group_id: this.group,
        details: this.details,
        split_equally: true,
      },
    });
    $.export("$summary", `Successfully created expense: ${this.description}`);
    return expense;
  },
};
