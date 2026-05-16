import FormData from "form-data";
import renderio from "../../renderio.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "renderio-upload-file",
  name: "Upload File",
  description: "Upload a file directly to RenderIO storage. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory, for example `/tmp/video.mp4`.",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
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

    const response = await this.renderio.uploadFile({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });
    $.export("$summary", `Successfully uploaded file${response.file_id
      ? ` ${response.file_id}`
      : ""}`);
    return response;
  },
};
