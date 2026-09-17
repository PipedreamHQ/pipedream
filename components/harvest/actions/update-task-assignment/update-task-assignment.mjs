import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-update-task-assignment",
  name: "Update Task Assignment",
  description: "Update a task assignment on a project. Use **List Task Assignments** to find IDs. Example: call with projectId, taskAssignmentId, and billable=false to stop billing that task on the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/#update-a-task-assignment).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
    taskAssignmentId: {
      propDefinition: [
        harvest,
        "taskAssignmentId",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the task assignment is active.",
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Whether the task assignment is billable.",
      optional: true,
    },
    hourlyRate: {
      type: "string",
      label: "Hourly Rate",
      description: "Hourly rate, decimal.",
      optional: true,
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "Budget, decimal.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.harvest.updateTaskAssignment({
      $,
      projectId: this.projectId,
      taskAssignmentId: this.taskAssignmentId,
      accountId: this.accountId,
      data: {
        is_active: this.isActive,
        billable: this.billable,
        hourly_rate: this.hourlyRate,
        budget: this.budget,
      },
    });
    $.export("$summary", `Successfully updated task assignment ${response.id}`);
    return response;
  },
};
