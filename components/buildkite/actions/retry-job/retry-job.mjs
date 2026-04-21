import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-retry-job",
  name: "Retry Job",
  description: "Retries a failed or timed out job. Each job can only be retried once. [See the documentation](https://buildkite.com/docs/apis/rest-api/jobs#retry-a-job)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      method: "PUT",
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/jobs/${this.jobId}/retry`,
    });
    $.export("$summary", `Successfully retried job — new job ID: ${response.id}`);
    return response;
  },
};
