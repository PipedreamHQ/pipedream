import bytenite from "../../bytenite.app.mjs";

export default {
  key: "bytenite-get-job-results",
  name: "Get Job Results",
  description: "Secures the link of the output from a finished encoding job. [See the documentation](https://docs.bytenite.com/reference/customer_getjobresults)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bytenite,
    jobId: {
      propDefinition: [
        bytenite,
        "jobId",
        () => ({
          completedOnly: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bytenite.getResults({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully fetched results for job ${this.jobId}`);
    return response;
  },
};
