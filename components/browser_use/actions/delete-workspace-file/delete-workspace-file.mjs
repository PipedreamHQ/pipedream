import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-delete-workspace-file",
  name: "Delete Workspace File",
  description: "Delete a file from a Browser Use workspace. [See the documentation](https://docs.browser-use.com/cloud/api-v3/workspaces/delete-workspace-file)",
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
    path: {
      type: "string",
      label: "File Path",
      description: "Relative workspace file path to delete. Example: `reports/data.csv`.",
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.deleteWorkspaceFile({
      $,
      workspaceId: this.workspaceId,
      params: {
        path: this.path,
      },
    });

    $.export("$summary", `Deleted workspace file ${this.path}`);
    return response;
  },
};
