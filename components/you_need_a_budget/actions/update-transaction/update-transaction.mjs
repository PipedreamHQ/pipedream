import app from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-update-transaction",
  name: "Update Transaction",
  description: "Update an existing transaction. [See the docs](https://api.youneedabudget.com/v1#/Transactions/updateTransaction)",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    budgetId: {
      propDefinition: [
        app,
        "budgetId",
      ],
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
        (c) => ({
          budgetId: c.budgetId,
        }),
      ],
    },
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The ID of the transaction to update.",
    },
    date: {
      propDefinition: [
        app,
        "date"
      ],
    },
    payee: {
      propDefinition: [
        app,
        "payee",
        (c) => ({
          budgetId: c.budgetId,
        })
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
        (c) => ({
          budgetId: c.budgetId,
          optional: true,
        }),
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount"
      ],
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "A short description",
      optional: true,
    },
    cleared: {
      type: "boolean",
      label: "Cleared",
      description: "Marking a transaction as cleared means it has posted to your bank account",
      optional: true,
    },
    approved: {
      type: "boolean",
      label: "Approved",
      description: "Approve it directly?",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.updateTransaction({
        transactionId: this.transactionId,
        accountId: this.accountId,
        date: this.date,
        payee: this.payee,
        budgetId: this.budgetId,
        categoryId: this.categoryId.value,
        amount: this.amount,
        memo: this.memo,
        cleared: this.cleared,
        approved: this.approved,
      });
      $.export("$summary", `Transaction ${this.transactionId} updated`);
      return response;
    } catch (error) {
      console.error("Error updating transaction", error);
      if (error.error) {
        this.app.throwFormattedError(error.error);
      }
      this.app.throwFormattedError(error);
    }
  },
};
