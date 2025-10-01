import app from "../../desktime.app.mjs";

export default {
  key: "desktime-create-project",
  name: "Create a New Project with an optional task",
  description: "Create a new project with an optional task in DeskTime. [See the documentation](https://desktime.com/app/settings/api?tab=project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    project: {
      propDefinition: [
        app,
        "project",
      ],
    },
    task: {
      propDefinition: [
        app,
        "task",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      params: {
        project: this.project,
        task: this.task,
      },
    });

    $.export("$summary", `Successfully created project '${this.project}'`);

    return response;
  },
};
