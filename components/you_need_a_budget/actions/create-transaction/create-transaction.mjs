import app from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-create-transaction",
  name: "Create Transaction",
  description: "Creates a single transaction. [See the docs](https://api.youneedabudget.com/v1#/Transactions/createTransaction)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
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
    accountId: {
      propDefinition: [
        app,
        "accountId",
        (c) => ({
          budgetId: c.budgetId,
        }),
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
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
    payee: {
      propDefinition: [
        app,
        "payee",
        (c) => ({
          budgetId: c.budgetId,
        }),
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
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
      const response = await this.app.createTransaction({
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
      $.export("$summary", `New transaction created in ${this.categoryId.label}`);
      return response;
    } catch (error) {
      if (error.error) {
        this.app.throwFormattedError(error.error);
      }
      this.app.throwFormattedError(error);
    }
  },
};
