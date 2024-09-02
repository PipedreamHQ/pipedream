import openai from "../../openai.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "openai-create-batch",
  name: "Create Batch",
  description: "Creates and executes a batch from an uploaded file of requests. [See the documentation](https://platform.openai.com/docs/api-reference/batch/create)",
  version: "0.0.4",
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
      label: "File Path",
      description: "The path to a .jsonl file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
      optional: true,
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    if (!this.fileId && !this.filePath) {
      throw new ConfigurationError("Must provide one of File ID or File Path");
    }

    let fileId = this.fileId;
    if (this.filePath) {
      const fileData = new FormData();
      const content = fs.createReadStream(this.filePath.includes("tmp/")
        ? this.filePath
        : `/tmp/${this.filePath}`);
      fileData.append("purpose", "batch");
      fileData.append("file", content);

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
