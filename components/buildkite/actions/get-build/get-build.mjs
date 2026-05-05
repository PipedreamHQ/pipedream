import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-get-build",
  name: "Get Build",
  description: "Returns the details for a single build, including its jobs. [See the documentation](https://buildkite.com/docs/apis/rest-api/builds#get-a-build)",
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
    includeRetriedJobs: {
      type: "boolean",
      label: "Include Retried Jobs",
      description: "Include all retried job executions in the response",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.includeRetriedJobs) params.include_retried_jobs = true;
    const response = await this.buildkite.getBuild({
      $,
      organizationSlug: this.organizationSlug,
      pipelineSlug: this.pipelineSlug,
      buildNumber: this.buildNumber,
      params,
    });
    $.export("$summary", `Successfully retrieved build #${response.number} (${response.state})`);
    return response;
  },
};
