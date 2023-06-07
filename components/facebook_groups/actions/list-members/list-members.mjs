import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-list-members",
  name: "List Members",
  description: "Retrieves a list of members in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/group/opted_in_members)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    maxResults: {
      propDefinition: [
        common.props.facebookGroups,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const members = await this.getResources({
      fn: this.facebookGroups.listMembers,
      args: {
        groupId: this.group,
        $,
      },
      maxResults: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${members.length} member${members.length === 1
      ? ""
      : "s"}`);

    return members;
  },
};
