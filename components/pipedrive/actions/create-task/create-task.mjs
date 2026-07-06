import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-create-task",
  name: "Create Task",
  description: "Creates a new task under a project (BETA). Run **List Projects** first to obtain a valid project ID. Use **List User ID Options** for the assignee ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Tasks#addTask)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task.",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project this task belongs to. Run **List Projects** first to obtain a valid project ID.",
    },
    parentTaskId: {
      type: "string",
      label: "Parent Task ID",
      description: "The ID of the parent task, if this is a subtask. Use **List Tasks** to obtain a valid task ID.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task.",
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
      description: "The due date of the task. Format: YYYY-MM-DD (e.g. 2026-07-31).",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the task. Format: YYYY-MM-DD.",
      optional: true,
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The user ID of the task assignee. Run **List User ID Options** to obtain a valid user ID.",
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
    const response = await this.pipedriveApp.addTask({
      title: this.title,
      project_id: this.projectId,
      parent_task_id: this.parentTaskId,
      description: this.description,
      done: this.done,
      milestone: this.milestone,
      due_date: this.dueDate,
      start_date: this.startDate,
      assignee_id: this.assigneeId,
      priority: this.priority,
    });
    $.export("$summary", `Successfully created task ${response.data?.id}: ${this.title}`);
    return response;
  },
};
