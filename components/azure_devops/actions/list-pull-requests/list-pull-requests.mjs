// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-pull-requests",
  name: "List Pull Requests",
  description: "List a repository's pull requests, optionally filtered by status, creator, reviewer or branch. Returns each pull request's id, title, status, source and target branches. Use this to find open review work or to check whether a branch already has a pull request. Example: status `active` targeting `refs/heads/main`. Returns at most **Limit** results per call - if that many come back there may be more, so raise **Skip** by **Limit** and call again to page through the rest. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-requests?view=azure-devops-rest-7.1)",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    status: {
      propDefinition: [
        azureDevops,
        "pullRequestStatus",
      ],
      description: "Only return pull requests in this status. Defaults to `active`.",
      optional: true,
    },
    creatorId: {
      type: "string",
      label: "Creator ID",
      description: "Only return pull requests created by this identity GUID, e.g. `d6245f20-2af8-44f4-9451-8107cb2767db`. Run the **List Users** action first to obtain valid values.",
      optional: true,
    },
    reviewerId: {
      propDefinition: [
        azureDevops,
        "reviewerId",
      ],
      description: "Only return pull requests this identity GUID is a reviewer on, e.g. `d6245f20-2af8-44f4-9451-8107cb2767db`. Run the **List Users** action first to obtain valid values.",
      optional: true,
    },
    sourceRefName: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      label: "Source Branch",
      description: "Only return pull requests originating from this fully qualified branch name, e.g. `refs/heads/feature/login`",
      optional: true,
    },
    targetRefName: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      description: "Only return pull requests targeting this fully qualified branch name, e.g. `refs/heads/main`",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of pull requests to return (1-1000)",
    },
    skip: {
      propDefinition: [
        azureDevops,
        "skip",
      ],
    },
  },
  async run({ $ }) {
    const { value: pullRequests } = await this.azureDevops.listPullRequests({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      params: {
        "searchCriteria.status": this.status,
        "searchCriteria.creatorId": this.creatorId,
        "searchCriteria.reviewerId": this.reviewerId,
        "searchCriteria.sourceRefName": this.sourceRefName,
        "searchCriteria.targetRefName": this.targetRefName,
        "$top": this.limit,
        "$skip": this.skip,
      },
    });
    $.export("$summary", `Found ${pullRequests.length} pull request${pullRequests.length === 1
      ? ""
      : "s"} in repository ${this.repositoryId}`);
    return pullRequests;
  },
};
