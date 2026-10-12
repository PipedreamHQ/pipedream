import harvest from "../../harvest.app.mjs";

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
      propDefinition: [
        harvest,
        "projectName",
      ],
      optional: false,
    },
    isBillable: {
      propDefinition: [
        harvest,
        "isBillable",
      ],
      optional: false,
    },
    billBy: {
      propDefinition: [
        harvest,
        "billBy",
      ],
      optional: false,
    },
    budgetBy: {
      propDefinition: [
        harvest,
        "budgetBy",
      ],
      optional: false,
    },
    code: {
      propDefinition: [
        harvest,
        "code",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the project is active.",
    },
    isFixedFee: {
      propDefinition: [
        harvest,
        "isFixedFee",
      ],
    },
    hourlyRate: {
      propDefinition: [
        harvest,
        "projectHourlyRate",
      ],
    },
    budget: {
      propDefinition: [
        harvest,
        "projectBudget",
      ],
    },
    costBudget: {
      propDefinition: [
        harvest,
        "costBudget",
      ],
    },
    notes: {
      propDefinition: [
        harvest,
        "projectNotes",
      ],
    },
    startsOn: {
      propDefinition: [
        harvest,
        "startsOn",
      ],
    },
    endsOn: {
      propDefinition: [
        harvest,
        "endsOn",
      ],
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
        cost_budget: this.costBudget,
        notes: this.notes,
        starts_on: this.startsOn,
        ends_on: this.endsOn,
      },
    });
    $.export("$summary", `Successfully created project ${response.id}: ${response.name}`);
    return response;
  },
};
