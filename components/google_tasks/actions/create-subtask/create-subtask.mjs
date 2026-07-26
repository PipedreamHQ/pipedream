// x-pd-ai: optimized
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-create-subtask",
  name: "Create Subtask",
  description:
    "Creates a subtask under an existing task. [See the docs here](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/insert)",
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
    parent: {
      propDefinition: [
        app,
        "taskId",
        ({ taskListId }) => ({
          taskListId,
        }),
      ],
      label: "Parent Task",
      description: "The parent task under which the subtask will be created.",
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
        "Optional. Place the new subtask immediately after another subtask.",
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

    const res = await this.app.insertTask(
      $,
      this.taskListId,
      data,
      params,
    );

    $.export("$summary", "Subtask successfully created");

    return res;
  },
};
