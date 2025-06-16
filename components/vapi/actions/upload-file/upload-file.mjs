import FormData from "form-data";
import vapi from "../../vapi.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "vapi-upload-file",
  name: "Upload File",
  description: "Uploads a new file. [See the documentation](https://docs.vapi.ai/api-reference)",
  version: "0.0.2",
  type: "action",
  props: {
    vapi,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFlie.pdf).",
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.vapi.uploadFile({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });
    $.export("$summary", `File uploaded successfully with ID ${response.id} and status ${response.status}`);
    return response;
  },
};
