// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-commits",
  name: "List Commits",
  description: "List a repository's commits, optionally narrowed by author, date range, branch or file path. Returns each commit's SHA, author, message and change counts. Use this to build a changelog or to find the commit that last touched a file. Example: author `jamal@fabrikam.com` since `2026-01-01T00:00:00Z`. Returns at most **Limit** results per call - if that many come back there may be more, so raise **Skip** by **Limit** and call again to page through the rest. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/commits/get-commits?view=azure-devops-rest-7.1)",
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
    version: {
      propDefinition: [
        azureDevops,
        "gitVersion",
      ],
      description: "Branch, tag or commit to list history from. Defaults to the repository's default branch.",
      optional: true,
    },
    versionType: {
      propDefinition: [
        azureDevops,
        "gitVersionType",
      ],
      optional: true,
    },
    author: {
      type: "string",
      label: "Author",
      description: "Alias or display name of the commit author to filter by",
      optional: true,
    },
    itemPath: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      label: "Item Path",
      description: "Return only commits that touched this repository-relative path, e.g. `/src/index.js`",
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Return commits made on or after this date, e.g. `2026-01-01T00:00:00Z`",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Return commits made on or before this date, e.g. `2026-01-31T00:00:00Z`",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of commits to return (1-1000)",
    },
    skip: {
      propDefinition: [
        azureDevops,
        "skip",
      ],
    },
  },
  async run({ $ }) {
    const { value: commits } = await this.azureDevops.listCommits({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      params: {
        "searchCriteria.itemVersion.version": this.version,
        "searchCriteria.itemVersion.versionType": this.versionType,
        "searchCriteria.author": this.author,
        "searchCriteria.itemPath": this.itemPath,
        "searchCriteria.fromDate": this.fromDate,
        "searchCriteria.toDate": this.toDate,
        "searchCriteria.$top": this.limit,
        "searchCriteria.$skip": this.skip,
      },
    });
    $.export("$summary", `Found ${commits.length} commit${commits.length === 1
      ? ""
      : "s"} in repository ${this.repositoryId}`);
    return commits;
  },
};
