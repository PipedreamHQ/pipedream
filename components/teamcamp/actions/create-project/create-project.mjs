import app from "../../teamcamp.app.mjs";

export default {
  key: "teamcamp-create-project",
  name: "Create Project",
  description: "Create a new project in the Workspace. [See the documentation](https://api.teamcamp.app/api-reference/project/createProject)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectName: {
      propDefinition: [
        app,
        "projectName",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        projectName: this.projectName,
        startDate: this.startDate,
        dueDate: this.dueDate,
      },
    });

    $.export("$summary", `Successfully created project with ID: '${response.projectId}'`);

    return response;
  },
};
