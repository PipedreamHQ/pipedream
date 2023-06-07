import facebookGroups from "../../facebook_groups.app.mjs";

export default {
  key: "facebook_groups-list-members",
  name: "List Members",
  description: "Retrieves a list of members in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/group/opted_in_members)",
  version: "0.0.1",
  type: "action",
  props: {
    facebookGroups,
    group: {
      propDefinition: [
        facebookGroups,
        "group",
      ],
    },
    maxResults: {
      propDefinition: [
        facebookGroups,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.facebookGroups.paginate({
      fn: this.facebookGroups.listMembers,
      args: {
        groupId: this.group,
        $,
      },
    });

    const members = [];
    let count = 0;
    for await (const member of response) {
      members.push(member);
      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${members.length} member${members.length === 1
      ? ""
      : "s"}`);

    return members;
  },
};
