import filepost from "../../filepost.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "filepost-upload-file",
  name: "Upload File",
  description: "Upload a file from a path in `/tmp` or a public URL, and get back a permanent CDN URL. [See the documentation](https://filepost.dev/docs#upload)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    filepost,
    filePathOrUrl: {
      propDefinition: [
        filepost,
        "filePath",
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
    const input = this.filePathOrUrl.trim();
    const form = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(input);

    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.filepost.uploadFile({
      $,
      data: form,
      headers: form.getHeaders(),
    });

    $.export("$summary", `File uploaded successfully. CDN URL: ${response.url}`);
    return response;
  },
};
