import app from "../../https_airbyte_com.app.mjs";
//Retorna sucesso, mas está criando novos workspaces ao invés de atualizá-los
export default {
  key: "https_airbyte_com-update-workspace",
  name: "Update Workspace",
  description: "Updates a workspace on Airbyte. [See the documentation](https://reference.airbyte.com/reference/updateworkspace)",
  version: "0.0.3",
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
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateWorkspace({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully updated the workspace with the ID ${this.workspaceId}`);
    return response;
  },
};
