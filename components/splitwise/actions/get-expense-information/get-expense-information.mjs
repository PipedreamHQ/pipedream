import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-get-expense-information",
  name: "Get Expense Information",
  description: "Gets an expense's information. [See docs here](https://dev.splitwise.com/#tag/expenses/paths/~1get_expense~1{id}/get).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    splitwise,
    expense: {
      propDefinition: [
        splitwise,
        "expense",
      ],
    },
  },
  async run({ $ }) {
    const expense = await this.splitwise.getExpense({
      $,
      id: this.expense,
    });
    $.export("$summary", `Successfully retrieved expense: ${expense.description}`);
    return expense;
  },
};
