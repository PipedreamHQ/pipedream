import app from "../../rollbar.app.mjs";

export default {
  key: "rollbar-delete-a-project",
  name: "Delete a Project",
  description: "Deletes a project in Rollbar. [See the documentation](https://docs.rollbar.com/reference/delete-a-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteProject({
      $,
      projectId: this.projectId,
    });

    $.export("$summary", `Successfully deleted project with ID ${this.projectId}`);

    return response;
  },
};
