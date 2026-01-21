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
      type: "string",
      label: "Member ID",
      description: "The ID of the member to retrieve. Leave blank to use the authenticated user. Type in the search field to get members to select from.",
      optional: true,
      useQuery: true,
      async options({ query }) {
        if (!query) {
          return [];
        }
        const members = await this.trello.searchMembers({
          params: {
            query,
          }
        })
        return members?.map((member) => ({
          label: member.fullName,
          value: member.id,
        })) || [];
      },
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