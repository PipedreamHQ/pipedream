import app from "../../figranium.app.mjs";

export default {
  key: "figranium-get-schedule-status",
  name: "Get Schedule Status",
  description: "Get the schedule status and next run time for a specific task. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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

    const response = await app.getScheduleStatus({
      $,
      taskId,
    });

    $.export("$summary", `Successfully retrieved schedule status for task \`${taskId}\`.`);
    return response;
  },
};
