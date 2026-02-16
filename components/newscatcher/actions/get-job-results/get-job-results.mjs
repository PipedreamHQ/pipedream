import newscatcher from "../../newscatcher.app.mjs";

export default {
  key: "newscatcher-get-job-results",
  name: "Get Job Results",
  description: "Get the results of a job in Newscatcher. [See the documentation](https://www.newscatcherapi.com/docs/web-search-api/api-reference/jobs/get-job-results)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    newscatcher,
    jobId: {
      propDefinition: [
        newscatcher,
        "jobId",
      ],
    },
    page: {
      propDefinition: [
        newscatcher,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        newscatcher,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.newscatcher.getJobResults({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully retrieved results for job ${this.jobId}`);
    return response;
  },
};
