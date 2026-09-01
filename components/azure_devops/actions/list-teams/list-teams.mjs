// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-teams",
  name: "List Teams",
  description: "List the teams in a project. Returns each team's id, name and description. Use this to obtain the team id or name the other team actions need, or to fan a notification out per team. Example: project `Fabrikam-Fiber-Git` returns `Fabrikam-Fiber-Git Team`. Returns at most **Limit** results per call - if that many come back there may be more, so raise **Skip** by **Limit** and call again to page through the rest. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/teams/get-teams?view=azure-devops-rest-7.1)",
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
    mine: {
      type: "boolean",
      label: "Only My Teams",
      description: "Return only the teams the authenticated user is a member of.",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
    },
    skip: {
      propDefinition: [
        azureDevops,
        "skip",
      ],
    },
    expandIdentity: {
      type: "boolean",
      label: "Expand Identity",
      description: "Expand the identity information held against each team",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: teams } = await this.azureDevops.listTeams({
      $,
      organization: this.organization,
      projectId: this.project,
      params: {
        $mine: this.mine,
        $top: this.limit,
        $skip: this.skip,
        $expandIdentity: this.expandIdentity,
      },
    });
    $.export("$summary", `Found ${teams.length} team${teams.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return teams;
  },
};
