import mistralAI from "../../mistral_ai.app.mjs";

export default {
  key: "mistral_ai-get-batch-job-details",
  name: "Get Batch Job Details",
  description: "Get the details of a batch job by its ID. [See the Documentation](https://docs.mistral.ai/api/#tag/batch/operation/jobs_api_routes_batch_get_batch_job)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mistralAI,
    batchJobId: {
      propDefinition: [
        mistralAI,
        "batchJobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mistralAI.getBatchJob({
      $,
      jobId: this.batchJobId,
    });
    if (response?.id) {
      $.export("$summary", `Successfully retrieved details for batch job with ID: ${this.batchJobId}`);
    }
    return response;
  },
};
