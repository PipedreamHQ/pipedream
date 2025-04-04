import mistralAI from "../../mistral_ai.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObj } from "../../common/utils.mjs";

export default {
  key: "mistral_ai-create-batch-job",
  name: "Create Batch Job",
  description: "Create a new batch job, it will be queued for processing. [See the Documentation](https://docs.mistral.ai/api/#tag/batch/operation/jobs_api_routes_batch_get_batch_jobs)",
  version: "0.0.1",
  type: "action",
  props: {
    mistralAI,
    inputFiles: {
      propDefinition: [
        mistralAI,
        "fileIds",
      ],
    },
    modelId: {
      propDefinition: [
        mistralAI,
        "modelId",
      ],
    },
    endpoint: {
      type: "string",
      label: "Endpoint",
      description: "The endpoint to use for the batch job",
      options: constants.BATCH_JOB_ENDPOINT_OPTIONS,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Optional metadata for the batch job in JSON format.",
      optional: true,
    },
    timeoutHours: {
      type: "integer",
      label: "Timeout Hours",
      description: "Optional timeout duration for the batch job in hours.",
      optional: true,
      default: 24,
    },
  },
  async run({ $ }) {
    const response = await this.mistralAI.createBatchJob({
      $,
      data: {
        input_files: this.inputFiles,
        endpoint: this.endpoint,
        model: this.modelId,
        metadata: parseObj(this.metadata),
        timeoutHours: this.timeoutHours,
      },
    });
    if (response?.id) {
      $.export("$summary", `Successfully created batch job with ID: ${response.id}`);
    }
    return response;
  },
};
