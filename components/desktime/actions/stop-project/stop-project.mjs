import app from "../../desktime.app.mjs";

export default {
  key: "desktime-stop-project",
  name: "Stop Project",
  description: "Stop tracking time for a given project and optionally a task. [See the documentation](https://desktime.com/app/settings/api?tab=project)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    const response = await this.app.stopTracking({
      $,
      params: {
        project: this.project,
        task: this.task,
      },
    });

    $.export("$summary", `Tracking of project \`${this.project}\` stopped successfully`);

    return response;
  },
};
