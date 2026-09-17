import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-update-project",
  name: "Update Project",
  description: "Update an existing project. Use **Get Projects** to find a project ID. Example: call with projectId set to a project's ID and projectName set to a new name to rename it. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/projects/#update-a-project).",
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
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
      optional: true,
    },
    isBillable: {
      type: "boolean",
      label: "Is Billable",
      description: "Whether the project is billable.",
      optional: true,
    },
    billBy: {
      type: "string",
      label: "Bill By",
      description: "One of: `Project`, `Tasks`, `People`, `none`.",
      optional: true,
      options: constants.BILL_BY_OPTIONS,
    },
    budgetBy: {
      type: "string",
      label: "Budget By",
      description: "Method by which the project is budgeted. `project`, `task`, and `person` budget in hours (set Budget); `project_cost` and `task_fees` budget in money (set Cost Budget); `none` sets no budget.",
      optional: true,
      options: constants.BUDGET_BY_OPTIONS,
    },
    code: {
      type: "string",
      label: "Code",
      description: "The code associated with the project.",
      optional: true,
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the project is active.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the project.",
      optional: true,
    },
    isFixedFee: {
      type: "boolean",
      label: "Is Fixed Fee",
      description: "Whether the project is a fixed-fee project.",
      optional: true,
    },
    hourlyRate: {
      type: "string",
      label: "Hourly Rate",
      description: "Rate for projects billed by Project Hourly Rate, decimal.",
      optional: true,
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "The budget in **hours**, decimal. Only applies when Budget By is `project`, `task`, or `person`.",
      optional: true,
    },
    costBudget: {
      type: "string",
      label: "Cost Budget",
      description: "The budget in **money**, decimal. Only applies when Budget By is `project_cost` or `task_fees`.",
      optional: true,
    },
    startsOn: {
      type: "string",
      label: "Starts On",
      description: "Start date, format `YYYY-MM-DD`.",
      optional: true,
    },
    endsOn: {
      type: "string",
      label: "Ends On",
      description: "End date, format `YYYY-MM-DD`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.harvest.updateProject({
      $,
      projectId: this.projectId,
      accountId: this.accountId,
      data: {
        client_id: this.clientId,
        name: this.projectName,
        is_billable: this.isBillable,
        bill_by: this.billBy,
        budget_by: this.budgetBy,
        code: this.code,
        is_active: this.isActive,
        notes: this.notes,
        is_fixed_fee: this.isFixedFee,
        hourly_rate: this.hourlyRate,
        budget: this.budget,
        cost_budget: this.costBudget,
        starts_on: this.startsOn,
        ends_on: this.endsOn,
      },
    });
    $.export("$summary", `Successfully updated project ${response.id}: ${response.name}`);
    return response;
  },
};
