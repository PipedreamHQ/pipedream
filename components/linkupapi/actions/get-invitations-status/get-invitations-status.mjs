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
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const max = this.totalResults;
    const invitations = [];
    let offset = 0;
    let page = [];
    let hasMore = false;

    do {
      const { data } = await this.app.getInvitations({
        $,
        accountId: this.accountId,
        params: {
          count: max - invitations.length,
          offset,
        },
      });

      page = data?.invitations || [];
      invitations.push(...page);
      offset += page.length;
      hasMore = data?.pagination?.has_more;
    } while (page.length && invitations.length < max && hasMore);

    $.export("$summary", `Successfully retrieved ${invitations.length} received invitation${invitations.length === 1
      ? ""
      : "s"}`);
    return invitations;
  },
};
