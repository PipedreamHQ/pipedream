import { getFileStreamAndMetadata } from "@pipedream/platform";
import { Blob } from "buffer";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-send-file-upload",
  name: "Send File Upload",
  description: "Send a file upload. [See the documentation](https://developers.notion.com/reference/send-a-file-upload)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    fileUploadId: {
      propDefinition: [
        notion,
        "fileUploadId",
        () => ({
          status: "pending",
        }),
      ],
    },
    file: {
      type: "string",
      label: "Image File Path or URL",
      description: "The image to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myImage.jpg`).",
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
    } = await getFileStreamAndMetadata(this.file);

    const fileBinary = await new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    const response = await this.notion.sendFileUpload({
      file_upload_id: this.fileUploadId,
      file: {
        data: new Blob([
          fileBinary,
        ], {
          type: metadata.contentType,
        }),
        filename: metadata.name,
      },
    });

    $.export("$summary", `Successfully created file upload with ID ${response.id}`);
    return response;
  },
};
