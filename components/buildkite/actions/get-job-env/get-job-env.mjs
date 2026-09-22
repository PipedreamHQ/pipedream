import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-get-job-env",
  name: "Get Job Environment Variables",
  description: "Returns the environment variables for a specific job in a build. [See the documentation](https://buildkite.com/docs/apis/rest-api/jobs#get-a-jobs-environment-variables)",
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
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/jobs/${this.jobId}/env`,
    });
    const count = Object.keys(response.env || {}).length;
    $.export("$summary", `Successfully retrieved ${count} environment variable(s)`);
    return response;
  },
};
