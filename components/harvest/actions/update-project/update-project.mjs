import harvest from "../../harvest.app.mjs";

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
      propDefinition: [
        harvest,
        "projectName",
      ],
    },
    isBillable: {
      propDefinition: [
        harvest,
        "isBillable",
      ],
    },
    billBy: {
      propDefinition: [
        harvest,
        "billBy",
      ],
    },
    budgetBy: {
      propDefinition: [
        harvest,
        "budgetBy",
      ],
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
    notes: {
      propDefinition: [
        harvest,
        "projectNotes",
      ],
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
