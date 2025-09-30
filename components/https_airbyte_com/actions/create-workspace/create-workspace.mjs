import app from "../../https_airbyte_com.app.mjs";

export default {
  key: "https_airbyte_com-create-workspace",
  name: "Create Workspace",
  description: "Creates a workspace on Airbyte. [See the documentation](https://reference.airbyte.com/reference/createworkspace)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createWorkspace({
      $,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created the ${response.name} workspace`);
    return response;
  },
};
