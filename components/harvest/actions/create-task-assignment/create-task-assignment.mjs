import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-create-task-assignment",
  name: "Create Task Assignment",
  description: "Assign a task to a project. Use **Get Projects** to find a project ID and **List Tasks** to find a task ID. Example: call with projectId set to the Jurassic Park Construction project's ID and taskId set to the Genetics Research task's ID to put that task on the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/#create-a-task-assignment).",
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
    taskId: {
      propDefinition: [
        harvest,
        "taskId",
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
      description: "Rate used when the project's bill_by is Tasks, decimal.",
      optional: true,
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "Budget used when the project's budget_by is task or task_fees, decimal.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.harvest.createTaskAssignment({
      $,
      projectId: this.projectId,
      accountId: this.accountId,
      data: {
        task_id: this.taskId,
        is_active: this.isActive,
        billable: this.billable,
        hourly_rate: this.hourlyRate,
        budget: this.budget,
      },
    });
    $.export("$summary", `Successfully created task assignment ${response.id}`);
    return response;
  },
};
