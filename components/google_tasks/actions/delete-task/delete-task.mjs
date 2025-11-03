import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-delete-task",
  name: "Delete Task",
  description: "Deletes the authenticated user's specified task. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasks/delete)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskListId: {
      propDefinition: [
        app,
        "taskListId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        ({ taskListId }) => ({
          taskListId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.deleteTask($, this.taskListId, this.taskId);
    $.export("$summary", "Task successfully deleted");
    return res;
  },
};
