import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-workspace",
  name: "Get Workspace",
  description: "Get a Browser Use workspace by ID. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/get-workspace)",
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
    const response = await this.browserUse.getWorkspace({
      $,
      workspaceId: this.workspaceId,
    });

    $.export("$summary", `Retrieved workspace ${response.id}`);
    return response;
  },
};
