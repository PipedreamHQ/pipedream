import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-update-task",
  name: "Update Task",
  description: "Updates the authenticated user's specified task. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasks/update)",
  version: "0.0.4",
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
    title: {
      propDefinition: [
        app,
        "title",
      ],
      description: "The title of the task.",
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    completed: {
      propDefinition: [
        app,
        "completed",
      ],
      optional: true,
    },
    due: {
      propDefinition: [
        app,
        "due",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      id: this.taskId,
      title: this.title,
      status: this.completed
        ? "completed"
        : "needsAction",
      due: this.due,
    };
    if (this.notes) {
      data.notes = this.notes;
    }

    const res = await this.app.updateTask(
      $,
      this.taskListId,
      this.taskId,
      data,
    );
    $.export("$summary", "Task successfully updated");
    return res;
  },
};
