import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-team-days-off",
  name: "List Team Days Off",
  description: "List the days the whole team is off during an iteration, such as public holidays or a team offsite. Returns each range's start and end date. Use this to subtract non-working days before reading capacity as available hours. Run the **List Teams** action first for the team, then the **List Team Iterations** action for the iteration id. Example: returns `2026-08-25` to `2026-08-25` for a bank holiday. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/teamdaysoff/get?view=azure-devops-rest-7.1)",
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
    const response = await this.azureDevops.listTeamDaysOff({
      $,
      organization: this.organization,
      project: this.project,
      teamId: this.teamId,
      iterationId: this.iterationId,
    });
    const daysOff = response.daysOff ?? [];
    $.export("$summary", `Found ${daysOff.length} team day off range${daysOff.length === 1
      ? ""
      : "s"} in the iteration`);
    return response;
  },
};
