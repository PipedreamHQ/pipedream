import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-create-project",
  name: "Create Project",
  description: "Create a new project. Example: call with clientId set to InGen Corp's client ID, projectName=\"Compound Perimeter Fence Upgrade\", isBillable=true, billBy=\"Project\", budgetBy=\"none\". [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/projects/#create-a-project).",
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
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
      optional: false,
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
    isBillable: {
      type: "boolean",
      label: "Is Billable",
      description: "Whether the project is billable.",
    },
    billBy: {
      type: "string",
      label: "Bill By",
      description: "Method by which the project is invoiced. One of: `Project`, `Tasks`, `People`, `none`.",
      options: constants.BILL_BY_OPTIONS,
    },
    budgetBy: {
      type: "string",
      label: "Budget By",
      description: "Method by which the project is budgeted. One of: `project`, `project_cost`, `task`, `task_fees`, `person`, `none`.",
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
      description: "The budget in hours or money, decimal.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the project.",
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
    const response = await this.harvest.createProject({
      $,
      accountId: this.accountId,
      data: {
        client_id: this.clientId,
        name: this.projectName,
        is_billable: this.isBillable,
        bill_by: this.billBy,
        budget_by: this.budgetBy,
        code: this.code,
        is_active: this.isActive,
        is_fixed_fee: this.isFixedFee,
        hourly_rate: this.hourlyRate,
        budget: this.budget,
        notes: this.notes,
        starts_on: this.startsOn,
        ends_on: this.endsOn,
      },
    });
    $.export("$summary", `Successfully created project ${response.id}: ${response.name}`);
    return response;
  },
};
