import trello from "../../trello.app.mjs";

export default {
  key: "trello-get-member",
  name: "Get Member",
  description: "Gets a member by their ID. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-members/#api-members-id-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trello,
    memberId: {
      propDefinition: [
        trello,
        "searchMemberId",
      ],
      description: "The ID of the member to retrieve. Leave blank to use the authenticated user. Type in the search field to get members to select from.",
    },
  },
  async run({ $ }) {
    const member = await this.trello.getMember({
      $,
      memberId: this.memberId || this.trello.$auth.oauth_uid,
    });
    $.export("$summary", `Successfully retrieved member "${member.fullName}"`);
    return member;
  },
};
