import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-update-expense-status-to-reported",
  name: "Update Expense Status to Reported",
  description: "Marks an individual expense as included in a report. [See the documentation](https://developers.rydoo.com/reference/v3expensesreport)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    expenseId: {
      type: "string",
      label: "Expense ID",
      description: "The unique identifier (UUID) of the expense to mark as reported",
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.reportExpense({
      $,
      expenseId: this.expenseId,
    });

    $.export("$summary", `Successfully marked expense ${this.expenseId} as reported.`);
    return response;
  },
};
