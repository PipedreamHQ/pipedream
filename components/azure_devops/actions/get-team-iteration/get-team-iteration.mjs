// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-team-iteration",
  name: "Get Team Iteration",
  description: "Retrieve one of a team's iterations by id. Returns its name, path and the start date, finish date and timeframe recorded against it. Use this to pin down a sprint's window before measuring work item activity against it. Run the **List Teams** action first for the team, then the **List Team Iterations** action for the iteration id. Example: returns `Sprint 3` running `2026-08-17` to `2026-08-28`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/iterations/get?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
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
    const response = await this.azureDevops.getTeamIteration({
      $,
      organization: this.organization,
      project: this.project,
      teamId: this.teamId,
      iterationId: this.iterationId,
    });
    $.export("$summary", `Retrieved iteration ${response.name ?? this.iterationId}`);
    return response;
  },
};
