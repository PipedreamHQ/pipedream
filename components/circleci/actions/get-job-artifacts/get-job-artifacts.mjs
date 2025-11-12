import circleci from "../../circleci.app.mjs";

export default {
  key: "circleci-get-job-artifacts",
  name: "Get Job Artifacts",
  description: "Retrieves a job's artifacts. [See the documentation](https://circleci.com/docs/api/v2/index.html#tag/Job/operation/getJobArtifacts).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    circleci,
    projectSlug: {
      propDefinition: [
        circleci,
        "projectSlug",
      ],
    },
    pipelineId: {
      propDefinition: [
        circleci,
        "pipelineId",
        (c) => ({
          projectSlug: c.projectSlug,
        }),
      ],
    },
    workflowId: {
      propDefinition: [
        circleci,
        "workflowId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    jobNumber: {
      propDefinition: [
        circleci,
        "jobNumber",
        (c) => ({
          workflowId: c.workflowId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.circleci.getJobArtifacts({
      $,
      projectSlug: this.projectSlug,
      jobNumber: this.jobNumber,
    });
    $.export("$summary", `Successfully retrieved artifacts for job number: ${this.jobNumber}`);
    return response;
  },
};
