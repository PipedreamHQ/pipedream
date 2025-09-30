import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-create-task-list",
  name: "Create Task List",
  description: "Creates a new task list and adds it to the authenticated user's task lists. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasklists/insert)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.insertTaskList($, {
      title: this.title,
    });
    $.export("$summary", "Task list successfully created");
    return res;
  },
};
