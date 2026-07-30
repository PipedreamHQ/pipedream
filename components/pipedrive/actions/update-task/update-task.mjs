// x-pd-ai: optimized
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-task",
  name: "Update Task",
  description: "Updates an existing task (BETA). Run **List Tasks** first to obtain a valid task ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Tasks#updateTask)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to update. Run **List Tasks** first to obtain a valid task ID.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The updated title of the task.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The updated description of the task.",
      optional: true,
    },
    done: {
      type: "integer",
      label: "Done",
      description: "Whether the task is done. Integer: 0 (not done) or 1 (done).",
      min: 0,
      max: 1,
      optional: true,
    },
    milestone: {
      type: "integer",
      label: "Milestone",
      description: "Whether the task is a milestone. Integer: 0 (no) or 1 (yes).",
      min: 0,
      max: 1,
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task. Format: YYYY-MM-DD.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the task. Format: YYYY-MM-DD.",
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      label: "Assignee ID",
      description: "The user ID of the task assignee.",
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "The priority of the task (non-negative integer).",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.updateTask({
      $,
      taskId: this.taskId,
      title: this.title,
      description: this.description,
      is_done: this.done === undefined
        ? undefined
        : Boolean(Number(this.done)),
      is_milestone: this.milestone === undefined
        ? undefined
        : Boolean(Number(this.milestone)),
      due_date: this.dueDate,
      start_date: this.startDate,
      assignee_ids: this.assigneeId === undefined
        ? undefined
        : [
          this.assigneeId,
        ],
      priority: this.priority,
    });
    $.export("$summary", `Successfully updated task ${this.taskId}`);
    return response;
  },
};
