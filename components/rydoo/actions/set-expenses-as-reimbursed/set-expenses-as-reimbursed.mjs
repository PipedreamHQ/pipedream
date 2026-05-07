import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-set-expenses-as-reimbursed",
  name: "Set Expenses as Reimbursed",
  description: "Bulk updates a list of expense IDs to the Reimbursed status. [See the documentation](https://developers.rydoo.com/reference/v2expensesreimburseexpense)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    expenseIds: {
      propDefinition: [
        rydoo,
        "expenseIds",
      ],
      description: "Array of expense UUIDs to mark as reimbursed",
    },
    paymentReference: {
      type: "string",
      label: "Payment Reference",
      description: "A reference string for the reimbursement payment (e.g., a bank transfer ID)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.reimburseExpenses({
      $,
      data: {
        expenseIds: this.expenseIds,
        paymentReference: this.paymentReference,
      },
    });

    $.export("$summary", `Successfully marked ${this.expenseIds.length} expense${this.expenseIds.length === 1
      ? ""
      : "s"} as reimbursed.`);
    return response;
  },
};
