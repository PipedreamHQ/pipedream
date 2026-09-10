import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-commit",
  name: "Get Commit",
  description: "Retrieve one commit by its full 40-character SHA. Returns its author, committer, message, parents and change counts. Use this to inspect what a specific commit did before referencing it in a branch or release. Example: commit `a3fecf65a6766ebc6f2e33b66a1520b827c67ef8`. Run the **List Commits** action first to obtain valid commit SHAs. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/commits/get-commit?view=azure-devops-rest-7.1)",
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
    commitId: {
      propDefinition: [
        azureDevops,
        "commitId",
      ],
    },
    changeCount: {
      type: "integer",
      label: "Change Count",
      description: "Number of changed files to include in the response (max 1000)",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getCommit({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      commitId: this.commitId,
      params: {
        changeCount: this.changeCount,
      },
    });
    $.export("$summary", `Retrieved commit ${response.commitId}`);
    return response;
  },
};
