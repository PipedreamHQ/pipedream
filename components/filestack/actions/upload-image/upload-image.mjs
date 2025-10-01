import { getFileStreamAndMetadata } from "@pipedream/platform";
import filestack from "../../filestack.app.mjs";

export default {
  key: "filestack-upload-image",
  name: "Upload Image",
  description:
    "Upload an image from a file or URL to FileStack. [See the documentation](https://www.filestack.com/docs/uploads/uploading/#upload-file)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    filestack,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide a file URL or a path to a file in the `/tmp` directory.",
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
      filestack,
      file,
    } = this;

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(file);

    const response = await filestack.uploadImage({
      $,
      data: stream,
      headers: {
        "Content-Type": metadata.contentType,
        "Content-Length": metadata.size,
      },
    });

    $.export(
      "$summary",
      "Successfully uploaded image",
    );
    return response;
  },
};
