import app from "../../https_airbyte_com.app.mjs";

export default {
  key: "https_airbyte_com-delete-workspace",
  name: "Delete Workspace",
  description: "Deletes a workspace on Airbyte. [See the documentation](https://reference.airbyte.com/reference/deleteworkspace)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteWorkspace({
      $,
      workspaceId: this.workspaceId,
    });
    $.export("$summary", `Successfully deleted the workspace with ID ${this.workspaceId}`);
    return response;
  },
};
