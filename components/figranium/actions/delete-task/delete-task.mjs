import app from "../../figranium.app.mjs";

export default {
  key: "figranium-delete-task",
  name: "Delete Task",
  description: "Permanently delete a task. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
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

    const response = await app.deleteTask({
      $,
      taskId,
    });

    $.export("$summary", `Successfully deleted task \`${taskId}\`.`);
    return response;
  },
};
