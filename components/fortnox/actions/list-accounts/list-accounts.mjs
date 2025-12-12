import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-accounts",
  name: "List Accounts",
  description: "List all accounts in Fortnox. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Accounts/operation/list_2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { Accounts: accounts } = await this.app.listAccounts({
      $,
    });

    $.export("$summary", `Successfully retrieved ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}`);
    return accounts;
  },
};
