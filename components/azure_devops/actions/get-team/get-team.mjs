// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-team",
  name: "Get Team",
  description: "Retrieve one team in a project by id or name. Returns the team's description and identity url. Use this to resolve a team name to its GUID before querying its members. Example: `Fabrikam-Fiber-Git Team`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/teams/get?view=azure-devops-rest-7.1)",
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
    expandIdentity: {
      type: "boolean",
      label: "Expand Identity",
      description: "Include expanded identity information for the team in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getTeam({
      $,
      organization: this.organization,
      projectId: this.project,
      teamId: this.teamId,
      params: {
        $expandIdentity: this.expandIdentity,
      },
    });
    $.export("$summary", `Retrieved team ${response.id}: ${response.name}`);
    return response;
  },
};
