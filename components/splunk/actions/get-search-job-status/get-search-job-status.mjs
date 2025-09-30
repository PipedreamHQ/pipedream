import splunk from "../../splunk.app.mjs";

export default {
  key: "splunk-get-search-job-status",
  name: "Get Search Job Status",
  description: "Retrieve the status of a previously executed Splunk search job. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#search.2Fjobs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    splunk,
    jobId: {
      propDefinition: [
        splunk,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.splunk.getSearchJobStatus({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully retrieved status for job ID ${this.jobId}`);
    return response;
  },
};
