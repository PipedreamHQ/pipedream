import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-reject-expenses",
  name: "Reject Expenses",
  description: "Denies a set of expenses with a specific rejection reason and message. [See the documentation](https://developers.rydoo.com/reference/v2expensesrejectexpenses)",
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
      description: "Array of expense UUIDs to reject",
    },
    rejectReasonId: {
      type: "string",
      label: "Reject Reason ID",
      description: "The UUID of the predefined rejection reason",
    },
    message: {
      type: "string",
      label: "Message",
      description: "A custom message explaining the rejection",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.rejectExpenses({
      $,
      data: {
        expenseIds: this.expenseIds,
        rejectReasonId: this.rejectReasonId,
        message: this.message,
      },
    });

    $.export("$summary", `Successfully rejected ${this.expenseIds.length} expense${this.expenseIds.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
