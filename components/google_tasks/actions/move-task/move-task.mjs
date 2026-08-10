// x-pd-ai: optimized
import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-move-task",
  name: "Move Task",
  description:
    "Moves an existing task to a different position, parent task, or task list. Use this action to reorganize your task hierarchy or reorder tasks without modifying the task's title, notes, due date, or completion status. To update those properties, use the **Update Task** action instead. [See the documentation](https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/move)",
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
        "Optional. The ID of the destination task list (for example, `MDQ5MjE4NzQ2OTM0NjYxNzA6MDow`). You can obtain this ID using the **List Task Lists** action. If omitted, the task is moved within its current task list.",
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
      description:
        "Optional. The ID of the parent task under which the task will be moved (for example, `MDQ5MjE4NzQ2OTM0NjYxNzA6MDow`). You can obtain this ID using the **List Tasks** action.",
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
      description:
        "Optional. The ID of the sibling task after which the task should be placed (for example, `MDQ5MjE4NzQ2OTM0NjYxNzA6MDox`). You can obtain this ID using the **List Tasks** action.",
      optional: true,
    },
  },
  async run({ $ }) {
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

    $.export("$summary", `Moved task ${this.taskId}`);

    return res;
  },
};
