import FormData from "form-data";
import openai from "../../openai.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "openai-upload-file",
  name: "Upload File",
  description: "Upload a file that can be used across various endpoints/features. The size of individual files can be a maximum of 512mb. [See the documentation](https://platform.openai.com/docs/api-reference/files/create)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    file: {
      propDefinition: [
        openai,
        "file",
      ],
    },
    purpose: {
      propDefinition: [
        openai,
        "purpose",
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
    const {
      file, purpose,
    } = this;
    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);
    data.append("purpose", purpose);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.openai.uploadFile({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded file with purpose: ${purpose}`);
    return response;
  },
};
