import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-team-members",
  name: "List Team Members",
  description: "List the members of a team. Returns each member's display name, unique name, identity id and whether they are a team admin. Use this to find the identity GUID that the pull request reviewer actions require. Example: team `Fabrikam-Fiber-Git Team` returns Jamal Hartnett and his identity id. Returns at most **Limit** results per call - if that many come back there may be more, so raise **Skip** by **Limit** and call again to page through the rest. Run the **List Teams** action first to obtain the team id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/teams/get-team-members-with-extended-properties?view=azure-devops-rest-7.1)",
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
  },
  async run({ $ }) {
    const { value: members } = await this.azureDevops.listTeamMembers({
      $,
      organization: this.organization,
      projectId: this.project,
      teamId: this.teamId,
      params: {
        $top: this.limit,
        $skip: this.skip,
      },
    });
    $.export("$summary", `Found ${members.length} member${members.length === 1
      ? ""
      : "s"} in team ${this.teamId}`);
    return members;
  },
};
