import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-get-user",
  name: "Get User",
  description: "Retrieve a user from a workspace on Zenkit. [See the docs](https://base.zenkit.com/docs/api/workspaces/get-api-v1-workspaces-workspaceid-users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.zenkit,
        "userId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const users = await this.zenkit.listWorkspaceUsers({
      workspaceId: this.workspaceId,
      $,
    });
    const user = users.find((user) => user.id == this.userId);
    $.export("$summary", `Successfully retrieved user '${user.fullname}'`);
    return user;
  },
};
