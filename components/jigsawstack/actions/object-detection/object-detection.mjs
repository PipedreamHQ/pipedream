import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import mime from "mime";
import {
  checkTmp,
  throwError,
} from "../../common/utils.mjs";
import jigsawstack from "../../jigsawstack.app.mjs";

export default {
  key: "jigsawstack-object-detection",
  name: "Object Detection",
  description: "Recognize objects within a provided image and retrieve it with great accuracy. [See the documentation](https://docs.jigsawstack.com/api-reference/ai/object-detection)",
  version: "0.0.1",
  type: "action",
  props: {
    jigsawstack,
    url: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to process.",
      optional: true,
    },
    fileStoreKey: {
      type: "string",
      label: "File Store Key",
      description: "The key used to store the image on Jigsawstack file [Storage](https://docs.jigsawstack.com/api-reference/store/file/add).",
      optional: true,
    },
    imageFile: {
      type: "string",
      label: "Image File",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      jigsawstack,
      ...data
    } = this;

    if (Object.keys(data).length > 1) {
      throw new ConfigurationError("You must provide only one option, either the **Image URL**, the **Image File**, or the **File Storage Key**.");
    }

    if (data.fileStoreKey) data.file_store_key = data.fileStoreKey;

    if (data.imageFile) {
      const filePath = checkTmp(data.imageFile);
      const file = fs.readFileSync(filePath);
      const { key } = await jigsawstack.uploadFile({
        headers: {
          "Content-Type": mime.getType(filePath),
        },
        data: file,
      });
      data.file_store_key = key;
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
