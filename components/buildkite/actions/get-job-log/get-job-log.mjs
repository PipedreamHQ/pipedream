import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-get-job-log",
  name: "Get Job Log",
  description: "Returns the log output for a specific job in a build. [See the documentation](https://buildkite.com/docs/apis/rest-api/jobs#get-a-jobs-log-output)",
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
    format: {
      type: "string",
      label: "Format",
      description: "The format of the log output",
      optional: true,
      default: "json",
      options: [
        {
          label: "JSON (structured with header times)",
          value: "json",
        },
        {
          label: "Plain text (raw log content)",
          value: "text",
        },
        {
          label: "HTML (rendered by Terminal)",
          value: "html",
        },
      ],
    },
  },
  async run({ $ }) {
    let ext = "";
    let accept;
    if (this.format === "text") {
      accept = "text/plain";
      ext = ".txt";
    } else if (this.format === "html") {
      accept = "text/html";
      ext = ".html";
    } else {
      accept = "application/json";
    }
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines/${this.pipelineSlug}/builds/${this.buildNumber}/jobs/${this.jobId}/log${ext}`,
      headers: {
        Accept: accept,
      },
    });
    $.export("$summary", `Successfully retrieved log for job ${this.jobId}`);
    return response;
  },
};
