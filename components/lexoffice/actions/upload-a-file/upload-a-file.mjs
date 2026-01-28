import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import lexoffice from "../../lexoffice.app.mjs";

export default {
  key: "lexoffice-upload-a-file",
  name: "Upload A File",
  description: "Uploads a file to Lexware using the files endpoint. [See the documentation](https://developers.lexware.io/docs/#files-endpoint-upload-a-file).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lexoffice,
    filePathOrUrl: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`). Accepts only pdf, jpg, png and xml files.",
    },
    voucherId: {
      propDefinition: [
        lexoffice,
        "voucherId",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePathOrUrl);

    const data = new FormData();
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    if (!this.voucherId) {
      data.append("type", "voucher");
    }

    const response = await this.lexoffice.uploadFile({
      $,
      voucherId: this.voucherId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", this.voucherId
      ? `Successfully uploaded file to voucher ${this.voucherId}`
      : "Successfully uploaded file");

    return response;
  },
};

