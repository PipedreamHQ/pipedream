import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-download-artifact",
  name: "Download Artifact",
  description: "Returns a download URL for a specific artifact. [See the documentation](https://buildkite.com/docs/apis/rest-api/artifacts#download-an-artifact)",
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
        (c) => ({
          organizationSlug: c.organizationSlug,
          pipelineSlug: c.pipelineSlug,
        }),
      ],
    },
    jobId: {
      propDefinition: [
        buildkite,
        "jobId",
        (c) => ({
          organizationSlug: c.organizationSlug,
          pipelineSlug: c.pipelineSlug,
          buildNumber: c.buildNumber,
        }),
      ],
    },
    artifactId: {
      propDefinition: [
        buildkite,
        "artifactId",
        (c) => ({
          organizationSlug: c.organizationSlug,
          pipelineSlug: c.pipelineSlug,
          buildNumber: c.buildNumber,
          jobId: c.jobId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/jobs/${this.jobId}/artifacts/${this.artifactId}/download`,
    });
    $.export("$summary", `Successfully retrieved download URL for artifact ${this.artifactId}`);
    return response;
  },
};
