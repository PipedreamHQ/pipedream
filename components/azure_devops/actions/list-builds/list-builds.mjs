import azureDevops from "../../azure_devops.app.mjs";
import {
  BUILD_DELETED_FILTER_OPTIONS,
  BUILD_QUERY_ORDER_OPTIONS,
  BUILD_REASON_OPTIONS, BUILD_RESULT_OPTIONS, BUILD_STATUS_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-builds",
  name: "List Builds",
  description: "List a project's builds, optionally filtered by definition, status, result, branch or time window. Returns each build's id, number, status, result and triggering commit. Use this to report on CI health or to find the last successful build of a branch. Example: result `failed` on branch `refs/heads/main`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/list?view=azure-devops-rest-7.1)",
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
    definitionIds: {
      type: "string[]",
      label: "Build Definition IDs",
      description: "Only return builds for these definition IDs. Run the **List Build Definitions** action first to obtain valid values.",
      optional: true,
    },
    statusFilter: {
      type: "string",
      label: "Status",
      description: "Only return builds in this status",
      options: BUILD_STATUS_OPTIONS,
      optional: true,
    },
    resultFilter: {
      type: "string",
      label: "Result",
      description: "Only return builds with this result",
      options: BUILD_RESULT_OPTIONS,
      optional: true,
    },
    branchName: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      label: "Branch",
      description: "Only return builds that ran on this fully qualified branch name, e.g. `refs/heads/main`",
      optional: true,
    },
    queryOrder: {
      type: "string",
      label: "Query Order",
      description: "Order the results are returned in",
      options: BUILD_QUERY_ORDER_OPTIONS,
      optional: true,
    },
    minTime: {
      type: "string",
      label: "Min Time",
      description: "Only return builds after this date, e.g. `2026-01-01T00:00:00Z`. Interpreted against the field named by **Query Order**.",
      optional: true,
    },
    maxTime: {
      type: "string",
      label: "Max Time",
      description: "Only return builds before this date, e.g. `2026-01-31T00:00:00Z`. Interpreted against the field named by **Query Order**.",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of builds to return (1-1000)",
    },
    buildIds: {
      type: "string[]",
      label: "Build IDs",
      description: "Only return these build IDs, e.g. `[\"4821\", \"4822\"]`. Run the **List Builds** action first to obtain valid values.",
      optional: true,
    },
    buildNumber: {
      type: "string",
      label: "Build Number",
      description: "Only return builds matching this build number. Append `*` for a prefix search, e.g. `20260820.*`",
      optional: true,
    },
    reasonFilter: {
      type: "string",
      label: "Reason",
      description: "Only return builds started for this reason",
      options: BUILD_REASON_OPTIONS,
      optional: true,
    },
    requestedFor: {
      type: "string",
      label: "Requested For",
      description: "Only return builds requested by this identity GUID, e.g. `d6245f20-2af8-44f4-9451-8107cb2767db`. Run the **List Users** action first to obtain valid values.",
      optional: true,
    },
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
      description: "Only return builds from this repository. Requires **Repository Type**. Run the **List Repositories** action first to obtain valid values.",
      optional: true,
    },
    repositoryType: {
      type: "string",
      label: "Repository Type",
      description: "Type of the repository named in **Repository**, e.g. `TfsGit`, `GitHub`",
      optional: true,
    },
    tagFilters: {
      type: "string[]",
      label: "Tags",
      description: "Only return builds carrying all of these tags",
      optional: true,
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "Extended property names to return with each build",
      optional: true,
    },
    queues: {
      type: "string[]",
      label: "Queue IDs",
      description: "Only return builds that ran on these agent queue IDs, e.g. `[\"9\"]`. Queue IDs appear as `queue.id` on any build this action returns.",
      optional: true,
    },
    maxBuildsPerDefinition: {
      type: "integer",
      label: "Max Builds Per Definition",
      description: "Cap how many builds are returned for each definition",
      min: 1,
      optional: true,
    },
    deletedFilter: {
      type: "string",
      label: "Deleted Filter",
      description: "Whether to exclude, include or only return deleted builds. Defaults to `excludeDeleted`.",
      options: BUILD_DELETED_FILTER_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const builds = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({
        continuationToken, top,
      }) => this.azureDevops.listBuilds({
        $,
        organization: this.organization,
        project: this.project,
        params: {
          definitions: this.definitionIds?.length
            ? this.definitionIds.join(",")
            : undefined,
          statusFilter: this.statusFilter,
          resultFilter: this.resultFilter,
          branchName: this.branchName,
          queryOrder: this.queryOrder,
          minTime: this.minTime,
          maxTime: this.maxTime,
          buildNumber: this.buildNumber,
          reasonFilter: this.reasonFilter,
          requestedFor: this.requestedFor,
          repositoryId: this.repositoryId,
          repositoryType: this.repositoryType,
          maxBuildsPerDefinition: this.maxBuildsPerDefinition,
          deletedFilter: this.deletedFilter,
          buildIds: this.buildIds?.length
            ? this.buildIds.join(",")
            : undefined,
          tagFilters: this.tagFilters?.length
            ? this.tagFilters.join(",")
            : undefined,
          properties: this.properties?.length
            ? this.properties.join(",")
            : undefined,
          queues: this.queues?.length
            ? this.queues.join(",")
            : undefined,
          $top: top,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${builds.length} build${builds.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return builds;
  },
};
