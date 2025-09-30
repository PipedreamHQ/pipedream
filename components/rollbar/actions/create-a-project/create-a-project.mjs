import app from "../../rollbar.app.mjs";

export default {
  key: "rollbar-create-a-project",
  name: "Create a Project",
  description: "Creates a new project in Rollbar. [See the documentation](https://docs.rollbar.com/reference/create-a-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectName: {
      propDefinition: [
        app,
        "projectName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        name: this.projectName,
      },
    });

    $.export("$summary", `Successfully created project ${this.projectName}`);

    return response;
  },
};
