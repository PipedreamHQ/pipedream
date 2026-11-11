import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-team-capacity",
  name: "List Team Capacity",
  description: "Retrieve every team member's capacity for an iteration, with their per-day hours split across activities and their individual days off. Returns the per-member records and the team totals. Use this against the iteration's work item list to judge whether a sprint is overcommitted. Run the **List Teams** action first for the team, then the **List Team Iterations** action for the iteration id. Example: 6 hours per day split across `Development` and `Testing`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/capacities/get-capacities-with-identity-ref-and-totals?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
    },
    teamId: {
      propDefinition: [
        azureDevops,
        "teamId",
      ],
    },
    iterationId: {
      propDefinition: [
        azureDevops,
        "iterationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.listTeamCapacities({
      $,
      organization: this.organization,
      project: this.project,
      teamId: this.teamId,
      iterationId: this.iterationId,
    });
    $.export("$summary", `Retrieved team capacity for iteration ${this.iterationId}`);
    return response;
  },
};
