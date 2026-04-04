import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-download-artifact",
  name: "Download Artifact",
  description: "Returns a download URL for a specific artifact. [See the documentation](https://buildkite.com/docs/apis/rest-api/artifacts#download-an-artifact)",
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
      propDefinition: [
        buildkite,
        "jobId",
      ],
    },
    artifactId: {
      type: "string",
      label: "Artifact ID",
      description: "The UUID of the artifact to download",
    },
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/jobs/${this.jobId}/artifacts/${this.artifactId}/download`,
    });
    $.export("$summary", `Retrieved download URL for artifact ${this.artifactId}`);
    return response;
  },
};
