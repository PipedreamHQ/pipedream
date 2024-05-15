import openai from "../../openai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "openai-create-batch",
  name: "Create Batch",
  description: "Creates and executes a batch from an uploaded file of requests. [See the documentation](https://platform.openai.com/docs/api-reference/batch/create)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    fileId: {
      propDefinition: [
        openai,
        "fileId",
        () => ({
          purpose: "batch",
        }),
      ],
    },
    endpoint: {
      type: "string",
      label: "Endpoint",
      description: "The endpoint to be used for all requests in the batch",
      options: constants.BATCH_ENDPOINTS,
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.createBatch({
      $,
      data: {
        input_file_id: this.fileId,
        endpoint: this.endpoint,
        completion_window: "24h",
        metadata: this.metadata,
      },
    });
    $.export("$summary", `Successfully created batch with ID ${response.id}`);
    return response;
  },
};
