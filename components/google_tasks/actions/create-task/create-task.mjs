import googleTasks from "../../google_tasks.app.mjs";

export default {
  name: "Create Task",
  description: "Creates a new task. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasks/insert).",
  key: "google_tasks-create-task",
  version: "0.0.1",
  type: "action",
  props: {
    googleTasks,
  },
  async run({ $ }) {
    this.googleTasks.authKeys();
  },
};
