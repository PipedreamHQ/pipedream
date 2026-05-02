import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-get-account",
  name: "Get Account",
  description: "Retrieve a single account by GUID. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/account)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoft,
    accountId: {
      propDefinition: [
        microsoft,
        "accountId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const account = await this.microsoft.getAccountById({
      $,
      accountId: this.accountId,
    });

    $.export("$summary", `Retrieved account ${this.accountId}`);

    return account;
  },
};
