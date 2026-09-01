// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-team-settings",
  name: "Get Team Settings",
  description: "Retrieve a team's board and backlog configuration. Returns the days of the week the team works, its backlog iteration, its default iteration, how bugs are surfaced and which backlog levels are visible. Use this to learn a team's working week before turning sprint dates into working days. Run the **List Teams** action first to obtain the team. Example: `workingDays` returns Monday through Friday. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/teamsettings/get?view=azure-devops-rest-7.1)",
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
  },
  async run({ $ }) {
    const response = await this.azureDevops.getTeamSettings({
      $,
      organization: this.organization,
      project: this.project,
      teamId: this.teamId,
    });
    $.export("$summary", `Retrieved settings for team ${this.teamId}`);
    return response;
  },
};
