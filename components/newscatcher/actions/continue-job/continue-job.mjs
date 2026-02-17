import newscatcher from "../../newscatcher.app.mjs";

export default {
  key: "newscatcher-continue-job",
  name: "Continue Job",
  description: "Continue an existing job to process more records beyond the initial limit. [See the documentation](https://www.newscatcherapi.com/docs/web-search-api/api-reference/jobs/continue-job)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    newscatcher,
    jobId: {
      propDefinition: [
        newscatcher,
        "jobId",
      ],
      description: "Job identifier of the completed job to continue",
    },
    newLimit: {
      type: "integer",
      label: "New Limit",
      description: "New record limit for continued processing. Must be greater than the previous limit.",
    },
  },
  async run({ $ }) {
    const response = await this.newscatcher.continueJob({
      $,
      data: {
        job_id: this.jobId,
        new_limit: this.newLimit,
      },
    });
    $.export("$summary", `Successfully continued job with ID ${response.job_id}`);
    return response;
  },
};
