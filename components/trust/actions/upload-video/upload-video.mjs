import FormData from "form-data";
import app from "../../trust.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "trust-upload-video",
  name: "Upload Video",
  description: "Upload a video to the Trust platform. [See the documentation](https://api-docs.usetrust.io/uploads-a-video-to-be-used-for-testimonials).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    brandId: {
      propDefinition: [
        app,
        "brandId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    uploadVideo({
      brandId, ...args
    } = {}) {
      return this.app.post({
        path: `/media/upload-video/${brandId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadVideo,
      brandId,
      filePath,
    } = this;

    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await uploadVideo({
      $,
      brandId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", "Successfully uploaded video.");

    return response;
  },
};
