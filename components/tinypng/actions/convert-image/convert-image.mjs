import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { TYPE_OPTIONS } from "../../common/constants.mjs";
import tinypng from "../../tinypng.app.mjs";

export default {
  key: "tinypng-convert-image",
  name: "Convert Image",
  description: "Convert your images to your desired image type using TinyPNG. [See the documentation](https://tinypng.com/developers/reference#converting-images)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tinypng,
    imageId: {
      propDefinition: [
        tinypng,
        "imageId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Convert the image to another format ('jpeg', 'webp', or 'png').",
      options: TYPE_OPTIONS,
    },
    transformBackground: {
      type: "string",
      label: "Transform Background",
      description: "The background color to use when converting images with transparency to a format that does not support transparency (like JPEG). Use a hex value (e.g., '#FFFFFF') or 'white'/'black'.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const data = await this.tinypng.manipulateImage({
      $,
      imageId: this.imageId,
      data: {
        convert: {
          type: this.type,
        },
        ...this.transformBackground
          ? {
            transform: {
              background: this.transformBackground,
            },
          }
          : {},
      },
      responseType: "stream",
    });

    const ext = this.type.split("/").pop();

    const filePath = `/tmp/converted-image-${Date.parse(new Date())}.${ext}`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(data, fs.createWriteStream(filePath));

    $.export("$summary", `Successfully converted the image to ${this.type}`);
    return {
      filePath,
    };
  },
};
