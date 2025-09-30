import openai from "../../openai.app.mjs";
import constants from "../../common/constants.mjs";
import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "openai-create-batch",
  name: "Create Batch",
  description: "Creates and executes a batch from an uploaded file of requests. [See the documentation](https://platform.openai.com/docs/api-reference/batch/create)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    endpoint: {
      type: "string",
      label: "Endpoint",
      description: "The endpoint to be used for all requests in the batch",
      options: constants.BATCH_ENDPOINTS,
    },
    fileId: {
      propDefinition: [
        openai,
        "fileId",
        () => ({
          purpose: "batch",
        }),
      ],
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The .jsonl file to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`)",
      optional: true,
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.fileId && !this.filePath) {
      throw new ConfigurationError("Must provide one of File ID or File Path");
    }

    let fileId = this.fileId;
    if (this.filePath) {
      const fileData = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      fileData.append("purpose", "batch");
      fileData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      const { id } = await this.openai.uploadFile({
        $,
        data: fileData,
        headers: fileData.getHeaders(),
      });
      fileId = id;
    }

    const response = await this.openai.createBatch({
      $,
      data: {
        input_file_id: fileId,
        endpoint: this.endpoint,
        completion_window: "24h",
        metadata: this.metadata,
      },
    });
    $.export("$summary", `Successfully created batch with ID ${response.id}`);
    return response;
  },
};
