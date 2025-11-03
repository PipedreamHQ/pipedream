import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import mime from "mime";
import { throwError } from "../../common/utils.mjs";
import jigsawstack from "../../jigsawstack.app.mjs";

export default {
  key: "jigsawstack-object-detection",
  name: "Object Detection",
  description: "Recognize objects within a provided image and retrieve it with great accuracy. [See the documentation](https://docs.jigsawstack.com/api-reference/ai/object-detection)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jigsawstack,
    file: {
      type: "string",
      label: "Image File or URL",
      description: "The URL or file path of the image to process.",
      optional: true,
    },
    fileStoreKey: {
      type: "string",
      label: "File Store Key",
      description: "The key used to store the image on Jigsawstack file [Storage](https://docs.jigsawstack.com/api-reference/store/file/add).",
      optional: true,
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
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
      jigsawstack,
      file,
      fileStoreKey,
    } = this;

    const data = {};

    if (file && fileStoreKey) {
      throw new ConfigurationError("You must provide only one option, either the **Image File or URL** or the **File Storage Key**.");
    }
    if (!file && !fileStoreKey) {
      throw new ConfigurationError("You must provide either the **Image File or URL** or the **File Storage Key**.");
    }

    if (fileStoreKey) data.file_store_key = fileStoreKey;

    if (file) {
      if (file.startsWith("http")) {
        data.url = file;
      } else {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);
        const buffer = await this.streamToBuffer(stream);
        const { key } = await jigsawstack.uploadFile({
          headers: {
            "Content-Type": metadata.contentType ?? mime.getType(metadata.name),
          },
          data: buffer,
        });
        data.file_store_key = key;
      }
    }

    try {
      const response = await jigsawstack.detectObjectsInImage({
        $,
        data,
      });
      $.export("$summary", "Successfully detected objects in the image");
      return response;

    } catch (e) {
      return throwError(e);
    }
  },
};
