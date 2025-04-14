import mistralAI from "../../mistral_ai.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "mistral_ai-upload-file",
  name: "Upload File",
  description: "Upload a file that can be used across various endpoints. [See the Documentation](https://docs.mistral.ai/api/#tag/files/operation/files_api_routes_upload_file)",
  version: "0.0.1",
  type: "action",
  props: {
    mistralAI,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. The size of individual files can be a maximum of 512 MB. The Fine-tuning API only supports .jsonl files. [See the Pipedream documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The purpose of the file",
      options: [
        "fine-tune",
        "batch",
        "ocr",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const filePath = this.filePath.startsWith("/tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`;

    if (!fs.existsSync(filePath)) {
      throw new ConfigurationError(`File \`${filePath}\` not found`);
    }

    const fileContent = fs.createReadStream(filePath);
    const form = new FormData();
    form.append("file", fileContent);
    if (this.purpose) {
      form.append("purpose", this.purpose);
    }

    const response = await this.mistralAI.uploadFile({
      $,
      data: form,
      headers: form.getHeaders(),
    });

    if (response?.filename) {
      $.export("$summary", `Successfully uploaded file: ${response.filename}`);
    }

    return response;
  },
};
