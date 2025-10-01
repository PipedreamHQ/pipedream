import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-delete-task-list",
  name: "Delete Task List",
  description: "Deletes the authenticated user's specified task list. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasklists/delete)",
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
  },
  async run({ $ }) {
    const res = await this.app.deleteTaskList($, this.taskListId);
    $.export("$summary", "Task list successfully deleted");
    return res;
  },
};
