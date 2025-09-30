import app from "../../salesflare.app.mjs";

export default {
  key: "salesflare-add-user-to-account",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Add User To Account",
  description: "Adds a user to an account [See the docs here](https://api.salesflare.com/docs#operation/postAccountsAccount_idUsers)",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountIds",
      ],
      type: "integer",
      label: "Account ID",
      description: "Account ID",
      optional: false,
    },
    userIds: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "integer[]",
      label: "User IDs",
      description: "User IDs",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.addUsersToAccount({
      $,
      accountId: this.accountId,
      data: this.userIds.map(( id ) => ({
        id,
      })),
    });
    $.export("$summary", "User(s) has been added to the account successfully.");
    return resp;
  },
};
