// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import {
  BUILD_QUERY_ORDER_OPTIONS, BUILD_RESULT_OPTIONS, BUILD_STATUS_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-builds",
  name: "List Builds",
  description: "List a project's builds, optionally filtered by definition, status, result, branch or time window. Returns each build's id, number, status, result and triggering commit. Use this to report on CI health or to find the last successful build of a branch. Example: result `failed` on branch `refs/heads/main`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/list?view=azure-devops-rest-7.1)",
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
