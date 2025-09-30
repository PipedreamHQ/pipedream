import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-get-account-balances",
  name: "Get Account Balances",
  description: "Get the balances of a Nordigen account. [See the docs](https://ob.nordigen.com/api/docs#/accounts/accounts_balances_retrieve)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nordigen,
    requisitionId: {
      propDefinition: [
        nordigen,
        "requisitionId",
      ],
    },
    accountId: {
      propDefinition: [
        nordigen,
        "accountId",
        (c) => ({
          requisitionId: c.requisitionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const accountBalances = await this.nordigen.getAccountBalances(this.accountId, {
      $,
    });

    $.export("$summary", `Successfully retrieved account balances for account with ID ${this.accountId}`);

    return accountBalances;
  },
};
