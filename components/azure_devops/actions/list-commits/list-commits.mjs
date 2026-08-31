// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import {
  GIT_HISTORY_MODE_OPTIONS, GIT_VERSION_MODIFIER_OPTIONS,
} from "../../common/constants.mjs";

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
    versionOptions: {
      type: "string",
      label: "Version Options",
      description: "Modifier applied to **Version**, e.g. `previousChange` to start from the commit before it",
      options: GIT_VERSION_MODIFIER_OPTIONS,
      optional: true,
    },
    compareVersion: {
      type: "string",
      label: "Compare Version",
      description: "Return only commits between **Version** and this branch, tag or commit",
      optional: true,
    },
    compareVersionType: {
      propDefinition: [
        azureDevops,
        "gitVersionType",
      ],
      label: "Compare Version Type",
      description: "How to interpret **Compare Version**. Defaults to `branch`.",
      optional: true,
    },
    compareVersionOptions: {
      type: "string",
      label: "Compare Version Options",
      description: "Modifier applied to **Compare Version**",
      options: GIT_VERSION_MODIFIER_OPTIONS,
      optional: true,
    },
    ids: {
      type: "string[]",
      label: "Commit IDs",
      description: "Only return these commit SHAs, e.g. `a3fecf65a6766ebc6f2e33b66a1520b827c67ef8`. Azure DevOps treats this as an exclusive lookup: it cannot be combined with any other filter, though **Limit**, **Skip** and the include options still apply.",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "Alias or display name of the committer to filter by. **Author** filters on who wrote the change instead.",
      optional: true,
    },
    fromCommitId: {
      type: "string",
      label: "From Commit ID",
      description: "Walk history starting at this commit SHA, e.g. `a3fecf65a6766ebc6f2e33b66a1520b827c67ef8`. Run the **List Commits** action without a range first to obtain valid SHAs.",
      optional: true,
    },
    toCommitId: {
      type: "string",
      label: "To Commit ID",
      description: "Walk history up to this commit SHA, e.g. `a3fecf65a6766ebc6f2e33b66a1520b827c67ef8`. Run the **List Commits** action without a range first to obtain valid SHAs.",
      optional: true,
    },
    historyMode: {
      type: "string",
      label: "History Mode",
      description: "How merge commits are walked when **Item Path** is set. Defaults to `simplifiedHistory`.",
      options: GIT_HISTORY_MODE_OPTIONS,
      optional: true,
    },
    excludeDeletes: {
      type: "boolean",
      label: "Exclude Deletes",
      description: "Exclude commits whose only change to **Item Path** was deleting it",
      optional: true,
    },
    showOldestCommitsFirst: {
      type: "boolean",
      label: "Show Oldest Commits First",
      description: "Return the oldest commits first instead of the newest",
      optional: true,
    },
    includeWorkItems: {
      type: "boolean",
      label: "Include Work Items",
      description: "Include the work items associated with each commit. Use this to tie delivered code back to the stories it closed.",
      optional: true,
    },
    includePushData: {
      type: "boolean",
      label: "Include Push Data",
      description: "Include the push each commit arrived in",
      optional: true,
    },
    includeUserImageUrl: {
      type: "boolean",
      label: "Include User Image URL",
      description: "Include avatar urls for the author and committer",
      optional: true,
    },
    includeLinks: {
      propDefinition: [
        azureDevops,
        "includeLinks",
      ],
      description: "Include reference links for each commit",
    },
  },
  async run({ $ }) {
    if (this.ids?.length) {
      const conflicting = Object.entries({
        "Version": this.version,
        "Version Type": this.versionType,
        "Version Options": this.versionOptions,
        "Compare Version": this.compareVersion,
        "Compare Version Type": this.compareVersionType,
        "Compare Version Options": this.compareVersionOptions,
        "Author": this.author,
        "User": this.user,
        "Item Path": this.itemPath,
        "From Date": this.fromDate,
        "To Date": this.toDate,
        "From Commit ID": this.fromCommitId,
        "To Commit ID": this.toCommitId,
        "History Mode": this.historyMode,
        "Exclude Deletes": this.excludeDeletes,
        "Show Oldest Commits First": this.showOldestCommitsFirst,
      })
        .filter(([
          , value,
        ]) => value !== undefined && value !== null && value !== "")
        .map(([
          label,
        ]) => `**${label}**`);
      if (conflicting.length) {
        throw new ConfigurationError(`**Commit IDs** is an exclusive lookup and Azure DevOps rejects it alongside ${conflicting.join(", ")}. Remove those filters, or drop **Commit IDs**.`);
      }
    }
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
        "searchCriteria.itemVersion.versionOptions": this.versionOptions,
        "searchCriteria.compareVersion.version": this.compareVersion,
        "searchCriteria.compareVersion.versionType": this.compareVersionType,
        "searchCriteria.compareVersion.versionOptions": this.compareVersionOptions,
        "searchCriteria.user": this.user,
        "searchCriteria.fromCommitId": this.fromCommitId,
        "searchCriteria.toCommitId": this.toCommitId,
        "searchCriteria.historyMode": this.historyMode,
        "searchCriteria.excludeDeletes": this.excludeDeletes,
        "searchCriteria.showOldestCommitsFirst": this.showOldestCommitsFirst,
        "searchCriteria.includeWorkItems": this.includeWorkItems,
        "searchCriteria.includePushData": this.includePushData,
        "searchCriteria.includeUserImageUrl": this.includeUserImageUrl,
        "searchCriteria.includeLinks": this.includeLinks,
        "searchCriteria.ids": this.ids?.length
          ? this.ids.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Found ${commits.length} commit${commits.length === 1
      ? ""
      : "s"} in repository ${this.repositoryId}`);
    return commits;
  },
};
