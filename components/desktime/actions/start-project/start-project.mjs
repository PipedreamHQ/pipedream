import app from "../../desktime.app.mjs";

export default {
  key: "desktime-start-project",
  name: "Start Project",
  description: "Starts tracking time for a given project and optionally a task. [See the documentation](https://desktime.com/app/settings/api?tab=project)",
  version: "0.0.1",
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
    const response = await this.app.startTracking({
      $,
      params: {
        project: this.project,
        task: this.task,
      },
    });

    $.export("$summary", `Tracking of project '${this.project}' started successfully`);

    return response;
  },
};
