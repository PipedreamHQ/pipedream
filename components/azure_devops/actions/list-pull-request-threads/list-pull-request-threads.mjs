import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-pull-request-threads",
  name: "List Pull Request Comment Threads",
  description: "List the comment threads on a pull request, including threads anchored to a file and line. Returns each thread's comments, author and status. Use this to read review feedback before replying or completing the pull request. Example: pull request `12`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-threads/list?view=azure-devops-rest-7.1)",
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
    iteration: {
      type: "integer",
      label: "Iteration",
      description: "Track thread positions against this pull request iteration as the right side of the diff",
      min: 1,
      optional: true,
    },
    baseIteration: {
      type: "integer",
      label: "Base Iteration",
      description: "Track thread positions against this pull request iteration as the left side of the diff",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: threads } = await this.azureDevops.listPullRequestThreads({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      pullRequestId: this.pullRequestId,
      params: {
        $iteration: this.iteration,
        $baseIteration: this.baseIteration,
      },
    });
    $.export("$summary", `Found ${threads.length} comment thread${threads.length === 1
      ? ""
      : "s"} on pull request ${this.pullRequestId}`);
    return threads;
  },
};
