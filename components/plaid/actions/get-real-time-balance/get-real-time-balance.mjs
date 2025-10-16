import app from "../../plaid.app.mjs";

export default {
  key: "plaid-get-real-time-balance",
  name: "Get Real-Time Balance",
  description: "Get the real-time balance for each of an Item's accounts. [See the documentation](https://plaid.com/docs/api/products/balance/#accountsbalanceget).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    accessToken: {
      propDefinition: [
        app,
        "accessToken",
      ],
    },
    accountIds: {
      type: "string[]",
      label: "Account IDs",
      description: "The specific account IDs to filter by. If not provided, all accounts will be returned.",
      propDefinition: [
        app,
        "accountId",
        ({ accessToken }) => ({
          accessToken,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      accessToken,
      accountIds,
    } = this;

    const response = await app.getAccountsBalance({
      access_token: accessToken,
      options: {
        account_ids: accountIds,
      },
    });

    $.export("$summary", "Successfully fetched account balances");
    return response;
  },
};
