import zenkit from "../../zenkit.app.mjs";

export default {
  key: "zenkit-get-user",
  name: "Get User",
  description: "Retrieve a user from a workspace on Zenkit. [See the docs](https://base.zenkit.com/docs/api/workspaces/get-api-v1-workspaces-workspaceid-users)",
  version: "0.0.1",
  type: "action",
  props: {
    zenkit,
    workspaceId: {
      propDefinition: [
        zenkit,
        "workspaceId",
      ],
    },
    userId: {
      propDefinition: [
        zenkit,
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
    $.export("$summary", `Successfully retrieved user ${user.fullname}`);
    return user;
  },
};
