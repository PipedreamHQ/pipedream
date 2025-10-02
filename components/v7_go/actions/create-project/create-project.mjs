import v7Go from "../../v7_go.app.mjs";

export default {
  key: "v7_go-create-project",
  name: "Create Project",
  description: "Initiates the creation of a new project with a unique project identifier. [See the documentation](https://docs.go.v7labs.com/reference/project-create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    v7Go,
    workspaceId: {
      propDefinition: [
        v7Go,
        "workspaceId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
    },
  },
  async run({ $ }) {
    const response = await this.v7Go.createProject({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created project with ID ${response.id}`);
    return response;
  },
};
