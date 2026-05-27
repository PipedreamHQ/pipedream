import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-set-expense-to-reimbursed",
  name: "Set Expense to Reimbursed",
  description: "Sets an expense as reimbursed. [See the documentation](https://developers.rydoo.com/reference/v2expensesreimburseexpense)",
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
      propDefinition: [
        rydoo,
        "expenseId",
      ],
      description: "The ID of the expense to set as reimbursed.",
    },
    paymentReference: {
      type: "string",
      label: "Payment Reference",
      description: "The reference for the payment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.setExpenseAsReimbursed({
      $,
      data: [
        {
          expenseId: this.expenseId,
          paymentReference: this.paymentReference,
        },
      ],
    });
    if (response?.data?.length > 0 && response.data[0].errorCode) {
      throw new Error(response.data[0].message);
    }
    $.export("$summary", `Successfully set expense ${this.expenseId} as reimbursed.`);
    return response;
  },
};
