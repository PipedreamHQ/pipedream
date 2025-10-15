import app from "../../you_need_a_budget.app.mjs";

export default {
  key: "you_need_a_budget-list-accounts",
  name: "List Accounts",
  description: "List all accounts for a specific budget. [See the docs](https://api.ynab.com/v1#/Accounts/getAccounts)",
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
  },
  async run({ $ }) {
    try {
      const response = await this.app.getAccounts({
        budgetId: this.budgetId,
      });

      $.export("$summary", `${response.accounts.length} account${response.accounts.length > 1
        ? "s were"
        : " was"} successfully fetched!`);
      return response;
    } catch (error) {
      this.app.throwFormattedError(error?.error ?? error)
    }
  },
};
