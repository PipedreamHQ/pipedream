import hathrAi from "../../hathr_ai.app.mjs";
import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";

export default {
  key: "hathr_ai-upload-document",
  name: "Upload Document",
  description: "Uploads a document that can be used in future chat requests. [See the documentation](https://drive.google.com/drive/folders/1jtoSXqzhe-iwf9kfUwTCVQBu4iXVJO2x?usp=sharing)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hathrAi,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide a file URL or a path to a file in the `/tmp` directory.",
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

    const { response: { signedUrl } } = await this.hathrAi.getUploadUrl({
      $,
      data: {
        filename: metadata.name,
        type: metadata.contentType,
      },
    });

    await axios($, {
      method: "PUT",
      url: signedUrl,
      data: stream,
      headers: {
        "Content-Type": metadata.contentType,
        "Content-Length": metadata.size,
      },
    });

    $.export("$summary", "Successfully uploaded document.");
    return signedUrl;
  },
};
