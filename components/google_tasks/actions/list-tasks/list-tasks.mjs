import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-list-tasks",
  name: "List Tasks",
  description: "Returns all tasks in the specified task list. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasks/list)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    taskListId: {
      propDefinition: [
        app,
        "taskListId",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    showCompleted: {
      type: "boolean",
      label: "Show Completed",
      description: "Whether completed tasks are returned in the result. Optional. Defaults to `true`.",
      optional: true,
    },
    showDeleted: {
      type: "boolean",
      label: "Show Deleted",
      description: "Whether deleted tasks are returned in the result. Optional. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      maxResults: this.maxResults,
      showCompleted: this.showCompleted,
      showDeleted: this.showDeleted,
    };
    const res = await this.app.paginate(
      this.app.getTasks.bind(this),
      params,
      this.taskListId,
    );
    $.export("$summary", "Action successfully performed");
    return res;
  },
};
