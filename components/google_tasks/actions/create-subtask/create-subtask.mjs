import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-create-subtask",
  name: "Create Subtask",
  description:
    "Creates a new subtask under an existing parent task. Use this action when you want to organize related work into a task hierarchy while keeping the parent task unchanged. To create a top-level task instead, use the **Create Task** action. [See the documentation](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/insert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    taskListId: {
      propDefinition: [
        app,
        "taskListId",
      ],
    },
    parent: {
      propDefinition: [
        app,
        "taskId",
        ({ taskListId }) => ({
          taskListId,
        }),
      ],
      label: "Parent Task",
      description:
        "The ID of the parent task under which the subtask will be created (for example, `MDQ5MjE4NzQ2OTM0NjYxNzA6MDow`). You can obtain this ID using the **List Tasks** action.",
    },
    previous: {
      propDefinition: [
        app,
        "taskId",
        ({ taskListId }) => ({
          taskListId,
        }),
      ],
      label: "Place After Task",
      description:
        "Optional. The ID of the sibling task after which the new subtask should be inserted (for example, `MDQ5MjE4NzQ2OTM0NjYxNzA6MDox`). You can obtain this ID using the **List Tasks** action.",
      optional: true,
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
      description: "The title of the subtask.",
    },
    notes: {
      propDefinition: [
        app,
        "notes",
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
      due: this.due,
    };

    if (this.notes) {
      data.notes = this.notes;
    }

    const params = {
      parent: this.parent,
    };

    if (this.previous) {
      params.previous = this.previous;
    }

    const res = await this.app.insertTask($, this.taskListId, data, params);

    $.export("$summary", `Created subtask: ${this.title}`);

    return res;
  },
};
