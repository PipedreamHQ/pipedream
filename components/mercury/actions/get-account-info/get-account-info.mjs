import mercury from "../../mercury.app.mjs";

export default {
  key: "mercury-get-account-info",
  name: "Get Account Information",
  description: "Retrieve information about a specific account. [See the documentation](https://docs.mercury.com/reference/accountsid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mercury,
    account: {
      propDefinition: [
        mercury,
        "account",
      ],
    },
  },
  async run({ $ }) {
    const accountInfo = await this.mercury.getAccountInfo({
      ctx: $,
      accountId: this.account,
    });
    $.export("$summary", `Successfully retrieved information for account: ${this.account}`);
    return accountInfo;
  },
};
