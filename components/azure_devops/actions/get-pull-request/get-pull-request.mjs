import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-pull-request",
  name: "Get Pull Request",
  description: "Retrieve one pull request by id. Returns its title, description, status, reviewers, merge status and, optionally, its commits. Use this to check whether a pull request is mergeable before completing it. Example: pull request `12`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-request?view=azure-devops-rest-7.1)",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    pullRequestId: {
      propDefinition: [
        azureDevops,
        "pullRequestId",
      ],
    },
    includeCommits: {
      type: "boolean",
      label: "Include Commits",
      description: "Include the commits contained in the pull request",
      optional: true,
    },
    includeWorkItemRefs: {
      type: "boolean",
      label: "Include Work Item Refs",
      description: "Include references to the work items linked to the pull request",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getPullRequest({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      pullRequestId: this.pullRequestId,
      params: {
        includeCommits: this.includeCommits,
        includeWorkItemRefs: this.includeWorkItemRefs,
      },
    });
    $.export("$summary", `Retrieved pull request ${response.pullRequestId}: ${response.title}`);
    return response;
  },
};
