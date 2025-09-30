import { getFileStreamAndMetadata } from "@pipedream/platform";
import hootsuite from "../../hootsuite.app.mjs";

export default {
  key: "hootsuite-create-media-upload-job",
  name: "Create Media Upload Job",
  description: "Creates a new Media Upload Job on your Hootsuite account. [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/createMedia)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hootsuite,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The path or URL to the image file.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  methods: {
    initializeUpload(opts = {}) {
      return this.hootsuite._makeRequest({
        method: "POST",
        path: "/media",
        ...opts,
      });
    },
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
    uploadImage(url, fileBinary, headers) {
      return this.hootsuite._makeRequest({
        url,
        method: "PUT",
        maxBodyLength: Infinity,
        data: Buffer.from(fileBinary, "binary"),
        noHeaders: true,
        headers,
      });
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    const {
      data: {
        uploadUrl, id,
      },
    } = await this.initializeUpload({
      data: {
        sizeBytes: metadata.size,
        mimeType: metadata.contentType,
      },
    });

    const fileBinary = await this.streamToBuffer(stream);

    await this.uploadImage(uploadUrl, fileBinary, {
      "Content-Type": metadata.contentType,
    });

    $.export("$summary", `Successfully created media upload job with ID: ${id}`);
    return {
      fileId: id,
    };
  },
};
