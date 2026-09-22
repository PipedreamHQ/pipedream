import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-delete-workspace",
  name: "Delete Workspace",
  description: "Delete a Browser Use workspace and its stored files. This cannot be undone. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/delete-workspace)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.browserUse.deleteWorkspace({
      $,
      workspaceId: this.workspaceId,
    });

    $.export("$summary", `Deleted workspace ${this.workspaceId}`);
    return response;
  },
};
