import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-retry-job",
  name: "Retry Job",
  description: "Retries a failed or timed out job. Returns the new job. Each job can only be retried once — use the new job ID for subsequent retries. [See the documentation](https://buildkite.com/docs/apis/rest-api/jobs#retry-a-job)",
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
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      method: "PUT",
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/jobs/${this.jobId}/retry`,
    });
    $.export("$summary", `Retried job — new job ID: ${response.id}`);
    return response;
  },
};
