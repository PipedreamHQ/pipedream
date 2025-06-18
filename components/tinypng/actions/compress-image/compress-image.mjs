import { getFileStreamAndMetadata } from "@pipedream/platform";
import tinypng from "../../tinypng.app.mjs";

export default {
  key: "tinypng-compress-image",
  name: "Compress Image",
  description: "Compress a WebP, JPEG, or PNG image using the TinyPNG API. [See the documentation](https://tinypng.com/developers/reference#compressing-images)",
  version: "0.1.0",
  type: "action",
  props: {
    tinypng,
    file: {
      propDefinition: [
        tinypng,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);
    const headers = {
      "Content-Type": metadata.contentType,
      "content-disposition": "attachment; filename=" + metadata.name,
    };

    const response = await this.tinypng.compressImage({
      $,
      data,
      headers,
    });

    $.export("$summary", "Image processed successfully.");
    return response;
  },
};
