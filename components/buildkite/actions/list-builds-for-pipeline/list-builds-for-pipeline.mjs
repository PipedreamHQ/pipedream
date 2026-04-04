import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-builds-for-pipeline",
  name: "List Builds for Pipeline",
  description: "Returns a list of a pipeline's builds, filterable by state, branch, and commit. [See the documentation](https://buildkite.com/docs/apis/rest-api/builds#list-builds-for-a-pipeline)",
  version: "0.0.1",
  type: "action",
  props: {
    buildkite,
    organizationSlug: {
      propDefinition: [
        buildkite,
        "organizationSlug",
      ],
    },
    pipelineSlug: {
      propDefinition: [
        buildkite,
        "pipelineSlug",
        (c) => ({
          organizationSlug: c.organizationSlug,
        }),
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter by build state",
      optional: true,
      options: [
        "creating",
        "scheduled",
        "running",
        "passed",
        "failing",
        "failed",
        "blocked",
        "canceling",
        "canceled",
        "skipped",
        "not_run",
        "finished",
      ],
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Filter by branch name (e.g. `main`). Supports wildcards (e.g. `*dev*`)",
      optional: true,
    },
    commit: {
      type: "string",
      label: "Commit",
      description: "Filter by full commit SHA",
      optional: true,
    },
    createdFrom: {
      type: "string",
      label: "Created From",
      description: "Filter builds created on or after this time (ISO 8601 format)",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of results per page (max 100)",
      optional: true,
      default: 30,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.state) params.state = this.state;
    if (this.branch) params.branch = this.branch;
    if (this.commit) params.commit = this.commit;
    if (this.createdFrom) params.created_from = this.createdFrom;
    if (this.perPage) params.per_page = this.perPage;
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds`,
      params,
    });
    $.export("$summary", `Found ${response.length} build(s)`);
    return response;
  },
};
