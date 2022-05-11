import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-create-task",
  name: "Create Task",
  description: "Creates a new task and adds it to the authenticated user's task lists. [See the docs here](https://developers.google.com/tasks/reference/rest/v1/tasks/insert)",
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
    title: {
      propDefinition: [
        app,
        "title",
      ],
      description: "The title of the task.",
    },
    completed: {
      propDefinition: [
        app,
        "completed",
      ],
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
      title: this.title,
      status: this.completed
        ? "completed"
        : "needsAction",
      due: this.due,
    };
    const res = await this.app.insertTask(
      $,
      this.taskListId,
      data,
    );
    $.export("$summary", "Task successfully created");
    return res;
  },
};
