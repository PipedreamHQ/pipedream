import mistralAI from "../../mistral_ai.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "mistral_ai-upload-file",
  name: "Upload File",
  description: "Upload a file that can be used across various endpoints. [See the Documentation](https://docs.mistral.ai/api/#tag/files/operation/files_api_routes_upload_file)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mistralAI,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const form = new FormData();
    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
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
