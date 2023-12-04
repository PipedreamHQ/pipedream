import exhibitday from "../../exhibitday.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "exhibitday-create-task",
  name: "Create Task",
  description: "Creates a new task in ExhibitDay. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    exhibitday,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "The user assigned to the task",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task",
    },
    taskStatus: {
      type: "string",
      label: "Task Status",
      description: "The status of the task",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The description of the task",
      optional: true,
    },
    taskComponent: {
      type: "string",
      label: "Task Component",
      description: "The component of the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await axios($, {
      method: "POST",
      url: "https://api.exhibitday.com/tasks",
      headers: {
        Authorization: `Bearer ${this.exhibitday.$auth.api_key}`,
      },
      data: {
        taskId: this.taskId,
        taskName: this.taskName,
        assignee: this.assignee,
        dueDate: this.dueDate,
        taskStatus: this.taskStatus,
        taskDescription: this.taskDescription,
        taskComponent: this.taskComponent,
      },
    });
    $.export("$summary", `Successfully created task with ID ${this.taskId}`);
    return response;
  },
};
