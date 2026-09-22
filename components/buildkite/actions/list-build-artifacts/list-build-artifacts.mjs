import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-build-artifacts",
  name: "List Build Artifacts",
  description: "Returns a list of artifacts for a build. [See the documentation](https://buildkite.com/docs/apis/rest-api/artifacts#list-artifacts-for-a-build)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    buildNumber: {
      propDefinition: [
        buildkite,
        "buildNumber",
      ],
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "Filter artifacts to a specific job",
      optional: true,
    },
    limit: {
      propDefinition: [
        buildkite,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const jobPath = this.jobId
      ? `/jobs/${this.jobId}`
      : "";
    const results = [];
    for await (const artifact of this.buildkite.paginate({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}${jobPath}/artifacts`,
      max: this.limit,
    })) {
      results.push(artifact);
    }
    $.export("$summary", `Successfully retrieved ${results.length} artifact(s)`);
    return results;
  },
};
