import espoCrm from "../../espo-crm.app.mjs";

export default {
  key: "espo-crm-create-task",
  name: "Create Task in Espo CRM",
  description: "This component creates a new task in Espo CRM. [See the documentation](https://docs.espocrm.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    espoCrm,
    taskName: {
      type: "string",
      label: "Task Name",
      description: "Specify the task name",
    },
    taskDueDate: {
      type: "string",
      label: "Task Due Date",
      description: "Specify the task due date",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "Specify the task description",
      optional: true,
    },
    taskAssignedUser: {
      type: "string",
      label: "Task Assigned User",
      description: "Specify the user assigned to the task",
      optional: true,
    },
    taskPriority: {
      type: "string",
      label: "Task Priority",
      description: "Specify the task priority",
      optional: true,
    },
  },
  async run({ $ }) {
    const taskData = {
      name: this.taskName,
      dateEnd: this.taskDueDate,
    };

    if (this.taskDescription) taskData.description = this.taskDescription;
    if (this.taskAssignedUser) taskData.assignedUserId = this.taskAssignedUser;
    if (this.taskPriority) taskData.priority = this.taskPriority;

    const response = await this.espoCrm.createTask({
      data: taskData,
    });

    $.export("$summary", `Successfully created task ${this.taskName}`);
    return response;
  },
};
