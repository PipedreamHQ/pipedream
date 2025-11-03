import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-delete-task",
  name: "Delete Task",
  description: "Delete a task. [See the docs here](https://apidocs.teamwork.com/docs/teamwork/67114797aa90c-delete-a-task)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const res = this.app.deleteTask(this.taskId, $);
    $.export("$summary", "Task successfully deleted");
    return res;
  },
};
