// x-pd-ai: optimized
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-move-task",
  name: "Move Task",
  description:
    "Moves a task to another position, parent task, or task list. [See the docs here](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/move)",
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
    destinationTasklist: {
      propDefinition: [
        app,
        "taskListId",
      ],
      label: "Destination Task List",
      description:
        "Optional. The destination task list. If omitted, the task is moved within its current task list.",
      optional: true,
    },
    parent: {
      propDefinition: [
        app,
        "taskId",
        ({
          taskListId, destinationTasklist,
        }) => ({
          taskListId: destinationTasklist || taskListId,
        }),
      ],
      label: "Parent Task",
      description: "Optional. Move the task under another task as a subtask.",
      optional: true,
    },
    previous: {
      propDefinition: [
        app,
        "taskId",
        ({
          taskListId, destinationTasklist,
        }) => ({
          taskListId: destinationTasklist || taskListId,
        }),
      ],
      label: "Place After Task",
      description: "Optional. Place the task immediately after another task.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.destinationTasklist && !this.parent && !this.previous) {
      throw new Error(
        "Specify at least one of Destination Task List, Parent Task, or Place After Task.",
      );
    }

    const params = {};

    if (this.destinationTasklist) {
      params.destinationTasklist = this.destinationTasklist;
    }

    if (this.parent) {
      params.parent = this.parent;
    }

    if (this.previous) {
      params.previous = this.previous;
    }

    const res = await this.app.moveTask(
      $,
      this.taskListId,
      this.taskId,
      params,
    );

    $.export("$summary", "Task successfully moved");

    return res;
  },
};
