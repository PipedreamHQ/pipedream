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
    invitationType: {
      type: "string",
      label: "Invitation Type",
      description: "Filter received invitations by type (e.g. `CONNECTION`). Omit for all types.",
      optional: true,
    },
  },
  async run({ $ }) {
    const invitations = await this.app._paginate({
      max: this.totalResults,
      requestPage: ({
        next, count,
      }) => this.app.getInvitations({
        $,
        accountId: this.accountId,
        params: {
          count,
          offset: next || 0,
          invitation_type: this.invitationType,
        },
      }),
      getItems: (res) => res.data?.invitations,
      getNext: (res) => res.data?.pagination?.has_more
        ? res.data?.pagination?.next_offset
        : null,
    });

    $.export("$summary", `Successfully retrieved ${invitations.length} received invitation${invitations.length === 1
      ? ""
      : "s"}`);
    return invitations;
  },
};
