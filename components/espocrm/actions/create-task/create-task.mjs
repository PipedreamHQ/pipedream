import espoCrm from "../../espocrm.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "espocrm-create-task",
  name: "Create Task",
  description: "This component creates a new task in Espo CRM. [See the documentation](https://docs.espocrm.com/development/api/crud/#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    espoCrm,
    name: {
      type: "string",
      label: "Name",
      description: "Specify the task name",
    },
    assigneeId: {
      propDefinition: [
        espoCrm,
        "assigneeId",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Specify the task due date in the format `YYYY-MM-DD HH:MM:SS`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Specify the task description",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Specify the task status",
      options: constants.TASK_STATUS,
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Specify the task priority",
      options: constants.TASK_PRIORITY,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.espoCrm.createTask({
      data: {
        name: this.name,
        assignedUserId: this.assigneeId,
        dateEnd: this.dueDate,
        description: this.description,
        status: this.status,
        priority: this.priority,
      },
      $,
    });

    $.export("$summary", `Successfully created task ${this.name}.`);
    return response;
  },
};
