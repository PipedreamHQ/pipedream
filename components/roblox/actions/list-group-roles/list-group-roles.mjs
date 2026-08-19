import app from "../../roblox.app.mjs";

export default {
  key: "roblox-list-group-roles",
  name: "List Group Roles",
  description: "List the roles of a Roblox group. [See the documentation](https://create.roblox.com/docs/cloud/reference/GroupRole#Cloud_ListGroupRoles)",
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
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.app.getPaginatedResults({
      resourceFn: (args) => this.app.listGroupRoles({
        $,
        groupId: this.groupId,
        ...args,
      }),
      resourceKey: "groupRoles",
      max: this.maxResults,
    });
    $.export("$summary", `Retrieved ${results.length} group role${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
