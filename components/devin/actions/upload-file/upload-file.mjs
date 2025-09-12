import devin from "../../devin.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "devin-upload-file",
  name: "Upload File",
  description: "Upload files for Devin to use in sessions. [See the documentation](https://docs.devin.ai/api-reference/attachments/upload-files-for-devin-to-work-with)",
  version: "0.0.1",
  type: "action",
  props: {
    devin,
    filePathOrUrl: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePathOrUrl);
    const form = new FormData();
    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.devin.uploadFile({
      $,
      headers: form.getHeaders(),
      data: form,
    });

    $.export("$summary", `Successfully uploaded file: ${metadata.name}`);
    return response;
  },
};
