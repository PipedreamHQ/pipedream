import app from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-get-account",
  name: "Get Account",
  description: "Get an account specified by ID. [See the docs](https://api.ynab.com/v1#/Accounts/getAccountById)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    try {
      const response = await this.app.getAccount({
        budgetId: this.budgetId,
        accountId: this.accountId,
      });

      $.export("$summary", `Successfully fetched the account with ID: ${this.accountId}!`);
      return response;
    } catch (error) {
      this.app.throwFormattedError(error?.error ?? error)
    }
  },
};
