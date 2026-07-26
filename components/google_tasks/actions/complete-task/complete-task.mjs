// x-pd-ai: optimized
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-complete-task",
  name: "Complete Task",
  description:
    "Marks a task as completed. [See the docs here](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/update)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
    const data = {
      id: this.taskId,
      status: "completed",
    };

    const res = await this.app.updateTask(
      $,
      this.taskListId,
      this.taskId,
      data,
    );

    $.export("$summary", "Task successfully completed");

    return res;
  },
};
