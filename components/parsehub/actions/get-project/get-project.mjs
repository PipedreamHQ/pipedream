import app from "../../parsehub.app.mjs";

export default {
  key: "parsehub-get-project",
  name: "Get Project Details",
  description: "Retrieves the details of a specified project within the user's account. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#get-a-project)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getProjectDetails({
      $,
      projectId: this.projectId,
    });

    $.export("$summary", `Retrieved details for project ID: ${this.projectId}`);

    return response;
  },
};
