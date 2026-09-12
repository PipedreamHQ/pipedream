import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-get-account",
  name: "Get Account",
  description: "Get a delivered (saved) account: username, platform, country, profile URL, ban state."
    + " Use **List Accounts** to find account IDs."
    + " [See the documentation](https://developers.tokportal.com/saved-accounts/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tokportal,
    accountId: {
      propDefinition: [
        tokportal,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tokportal.getAccount({
      $,
      accountId: this.accountId,
    });
    const account = response?.data ?? response;
    $.export("$summary", `Retrieved account @${account?.username ?? this.accountId} (${account?.platform ?? "unknown platform"})`);
    return account;
  },
};
