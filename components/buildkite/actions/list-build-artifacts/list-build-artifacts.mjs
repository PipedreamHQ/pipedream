import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-build-artifacts",
  name: "List Build Artifacts",
  description: "Returns a list of artifacts for a build across all its jobs. [See the documentation](https://buildkite.com/docs/apis/rest-api/artifacts#list-artifacts-for-a-build)",
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
    buildNumber: {
      propDefinition: [
        buildkite,
        "buildNumber",
      ],
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "Filter artifacts to a specific job. If omitted, returns artifacts across all jobs",
      optional: true,
    },
  },
  async run({ $ }) {
    const jobPath = this.jobId
      ? `/jobs/${this.jobId}`
      : "";
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}${jobPath}/artifacts`,
    });
    $.export("$summary", `Found ${response.length} artifact(s)`);
    return response;
  },
};
