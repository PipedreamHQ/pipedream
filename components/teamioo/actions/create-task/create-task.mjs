import teamioo from "../../teamioo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teamioo-create-task",
  name: "Create Task",
  description: "Creates a new task in Teamioo. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.1",
  type: "action",
  props: {
    teamioo,
    taskTitle: {
      type: "string",
      label: "Task Title",
      description: "The title of the task",
    },
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of the task, either 'personal' or 'group'",
      options: [
        "personal",
        "group",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Whom the task is assigned to",
      optional: true,
    },
    priorityLevel: {
      type: "string",
      label: "Priority Level",
      description: "The urgency of the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.teamioo.createTask({
      taskTitle: this.taskTitle,
      taskType: this.taskType,
      dueDate: this.dueDate,
      assignedTo: this.assignedTo,
      priorityLevel: this.priorityLevel,
    });
    $.export("$summary", `Successfully created task: ${this.taskTitle}`);
    return response;
  },
};
