import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-invitations-status",
  name: "Get Invitations Status",
  description: "List pending connection invitations **received** by the connected account. Note: this returns invitations received, not ones you have sent. [See the documentation](https://docs.linkupapi.com/api-reference/v2/network/list-invitations)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getInvitations({
      $,
      accountId: this.accountId,
      params: {},
    });

    $.export("$summary", "Successfully retrieved invitation status");
    return response;
  },
};
