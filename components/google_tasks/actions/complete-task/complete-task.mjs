// x-pd-ai: optimized
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-complete-task",
  name: "Complete Task",
  description:
    "Marks an existing task as completed by setting its status to `completed`. Use this action when you want to complete a task without changing its title, notes, due date, or other properties. To modify those fields, use the Update Task action instead. [See the docs here](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/patch)",
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
    const res = await this.app.patchTask($, this.taskListId, this.taskId, {
      status: "completed",
    });

    $.export("$summary", "Task successfully completed");

    return res;
  },
};
