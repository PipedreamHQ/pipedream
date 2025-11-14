import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-get-accounts-following",
  name: "Get Accounts Following",
  description: "Get the accounts that the given account is following. [See the documentation](https://docs.joinmastodon.org/methods/accounts/#following)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mastodon,
    max: {
      propDefinition: [
        mastodon,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const accounts = await this.mastodon.paginate(this.mastodon.getAccountsFollowing, {
      $,
    }, this.max);
    $.export("$summary", `Successfully retrieved ${accounts.length} account(s) that the user is following`);
    return accounts;
  },
};
