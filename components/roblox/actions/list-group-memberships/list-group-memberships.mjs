import app from "../../roblox.app.mjs";

export default {
  key: "roblox-list-group-memberships",
  name: "List Group Memberships",
  description: "List the memberships (members) of a Roblox group. [See the documentation](https://create.roblox.com/docs/cloud/reference/GroupMembership#Cloud_ListGroupMemberships)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "Filter which memberships are returned, using the API's [filtering syntax](https://create.roblox.com/docs/cloud/reference/patterns#filtering). For example, `user == 'users/156'` or `role == 'groups/7750592/roles/38353811'`.",
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.app.getPaginatedResults({
      resourceFn: (args) => this.app.listGroupMemberships({
        $,
        groupId: this.groupId,
        ...args,
      }),
      args: {
        params: {
          filter: this.filter,
        },
      },
      resourceKey: "groupMemberships",
      max: this.maxResults,
    });
    $.export("$summary", `Retrieved ${results.length} group membership${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
