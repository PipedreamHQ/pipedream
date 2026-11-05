import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import app from "../../trengo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  type: "action",
  key: "trengo-upload-file",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Upload File",
  description: "Upload a file to attach to an email ticket reply. Pass the returned `id` to **Send A Ticket Message**'s `Attachment IDs`; unused uploads are removed automatically, so send the message soon after uploading. For WhatsApp, live chat or social channels, use **Send A Ticket Media Message** instead. [See the documentation](https://developers.trengo.com/reference/file-uploads)",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "A file URL or a path to a file in the `/tmp` directory (e.g. `/tmp/label.pdf`) (max 20 MB)",
      format: "file-ref",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The file name to show on the attachment, including the extension (e.g. `return-label.pdf`). Defaults to the source file's name.",
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
    } = await getFileStreamAndMetadata(this.file);
    const sizeMb = metadata.size / 1e6;
    if (sizeMb > constants.MAX_FILE_SIZE_MB) {
      stream.destroy();
      throw new ConfigurationError(`File is ${sizeMb.toFixed(1)} MB; Trengo accepts at most ${constants.MAX_FILE_SIZE_MB} MB.`);
    }

    const data = new FormData();
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: this.fileName || metadata.name,
    });

    const response = await this.app.uploadFile({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Uploaded file ${response.name} with ID ${response.id}`);
    return response;
  },
};
