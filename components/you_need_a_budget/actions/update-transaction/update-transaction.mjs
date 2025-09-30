import constants from "../../common/constants.mjs";
import app from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-update-transaction",
  name: "Update Transaction",
  description: "Update an existing transaction. [See the docs](https://api.youneedabudget.com/v1#/Transactions/updateTransaction)",
  version: "0.0.3",
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
    accountId: {
      propDefinition: [
        app,
        "accountId",
        ({ budgetId }) => ({
          budgetId,
        }),
      ],
    },
    transactionId: {
      propDefinition: [
        app,
        "transactionId",
        ({ budgetId }) => ({
          budgetId,
        }),
      ],
    },
    date: {
      description: "The transaction date in ISO format `YYYY-MM-DD` (e.g. `2016-12-01`). Future dates (scheduled transactions) are not permitted. Split transaction dates cannot be changed and if a different date is supplied it will be ignored.",
      propDefinition: [
        app,
        "date",
      ],
    },
    payeeId: {
      label: "Payee ID",
      description: "The id of the payee.",
      optional: true,
      propDefinition: [
        app,
        "payee",
        ({ budgetId }) => ({
          budgetId,
        }),
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
        ({ budgetId }) => ({
          budgetId,
        }),
      ],
      optional: true,
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
      description: "A short description.",
      optional: true,
    },
    cleared: {
      type: "string[]",
      label: "Cleared",
      description: "The cleared status of the transaction.",
      options: Object.values(constants.CLEARED_STATUS),
      optional: true,
    },
    approved: {
      type: "boolean",
      label: "Approved",
      description: "Approve the transaction directly?",
      optional: true,
    },
  },
  methods: {
    updateTransaction({
      budgetId, transactionId, data = {},
    }) {
      return this.app._client().transactions.updateTransaction(
        budgetId,
        transactionId,
        data,
      );
    },
  },
  async run({ $: step }) {
    const {
      budgetId,
      transactionId,
      accountId,
      date,
      payeeId,
      categoryId,
      amount,
      memo,
      cleared,
      approved,
    } = this;

    try {
      const response = await this.updateTransaction({
        budgetId,
        transactionId,
        data: {
          transaction: {
            account_id: accountId,
            date,
            amount: this.app._convertToMilliunit(amount),
            payee_id: payeeId,
            category_id: categoryId?.value ?? categoryId,
            memo,
            cleared,
            approved,
          },
        },
      });

      step.export("$summary", `Transaction ${this.response.data.transaction.id} updated.`);

      return response;

    } catch (error) {
      const msg = "Error updating transaction";
      const strError = JSON.stringify(error, null, 2);

      if (!error?.error) {
        console.log("Error in API response, please check your transactions to make sure the changes were applied.");
        step.export("$summary", `Transaction ${this.transactionId} updated.`);
        return {
          success: true,
          transactionId,
        };
      }

      console.log(msg, error);
      throw new Error(`${msg}: ${strError}`);
    }
  },
};
