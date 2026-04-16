import app from "../../upsales.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "upsales-upload-document",
  name: "Upload Document",
  description: "Uploads a document to Upsales. [See the documentation](https://api.upsales.com/#d9d71f21-919a-4ebc-b8e4-84c25b70de99)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
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
    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    const response = await this.app.uploadOrderDocument({
      $,
      orderId: this.orderId,
      data,
      headers: data.getHeaders(),
    });
    $.export("$summary", `Successfully uploaded document to order ${this.orderId}.`);
    return response;
  },
};
