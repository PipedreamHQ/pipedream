import taskade from "../../taskade.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "taskade-create-task",
  name: "Create Task",
  description: "Creates a new task in Taskade. [See the documentation](https://developers.taskade.com/docs/api/tasks/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    taskade,
    taskTitle: {
      type: "string",
      label: "Task Title",
      description: "The title of the task to be created",
      required: true,
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace where the task should be created",
      required: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task",
      optional: true,
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "The assignees for the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const task = await this.taskade.createTask(
      this.taskTitle,
      this.workspace,
      this.dueDate,
      this.assignees,
    );
    $.export("$summary", `Successfully created task ${this.taskTitle}`);
    return task;
  },
};
