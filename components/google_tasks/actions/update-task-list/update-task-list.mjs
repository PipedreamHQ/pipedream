import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-update-task-list",
  name: "Update Task List",
  description: "Updates the authenticated user's specified task list. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasklists/update)",
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
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.updateTaskList($, {
      id: this.taskListId,
      title: this.title,
    });
    $.export("$summary", "Task list successfully updated");
    return res;
  },
};
