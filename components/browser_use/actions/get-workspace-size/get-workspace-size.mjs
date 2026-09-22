import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-workspace-size",
  name: "Get Workspace Size",
  description: "Get storage usage for a Browser Use workspace. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/get-workspace-size)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    workspaceId: {
      propDefinition: [
        browserUse,
        "workspaceId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.getWorkspaceSize({
      $,
      workspaceId: this.workspaceId,
    });

    $.export("$summary", `Retrieved workspace size for ${this.workspaceId}`);
    return response;
  },
};
