import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-job-status",
  name: "Get Job Status",
  description: "Get the status of an Async job request. See the doc [here](https://docs.symbl.ai/docs/async-api/overview/jobs-api#http-request)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    symblAIApp,
    jobId: {
      type: "string",
      label: "Job Id",
      description: "The Id of the job request",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.symblAIApp.getJobStatus({
        $,
        jobId: this.jobId,
      });
      $.export("$summary", `Job status: ${response.status}`);
      return response;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve job status");
    }
  },
};
