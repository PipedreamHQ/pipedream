import app from "../../google_chat.app.mjs";

export default {
  key: "google_chat-list-members",
  name: "List Members",
  description: "Lists memberships in a space. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.members/list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The maximum number of memberships to return. If unspecified, at most 100 memberships are returned.",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "A page token, received from a previous call to list memberships. Provide this parameter to retrieve the subsequent page.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Specify a query filter by role and type. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.members/list#query-parameters)",
      optional: true,
    },
    showInvited: {
      type: "boolean",
      label: "Show Invited",
      description: "When true, also returns memberships associated with invited members, in addition to other types of memberships. If a filter is set, invited memberships that don't match the filter criteria aren't returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listMembers({
      $,
      spaceId: this.spaceId,
      params: {
        showInvited: this.showInvited,
        filter: this.filter,
        pageSize: this.pageSize,
        pageToken: this.pageToken,
      },
    });
    $.export("$summary", `Successfully fetched ${response.memberships.length} memberships`);
    return response;
  },
};
