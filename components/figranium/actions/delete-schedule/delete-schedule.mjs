import app from "../../figranium.app.mjs";

export default {
  key: "figranium-delete-schedule",
  name: "Delete Schedule",
  description: "Disable and remove the schedule from a task. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, taskId,
    } = this;

    const response = await app.deleteSchedule({
      $,
      taskId,
    });

    $.export("$summary", `Successfully deleted schedule for task \`${taskId}\`.`);
    return response;
  },
};
