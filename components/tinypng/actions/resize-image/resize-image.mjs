import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import tinypng from "../../tinypng.app.mjs";

export default {
  key: "tinypng-resize-image",
  name: "Resize Image",
  description: "Create resized versions of your uploaded image. [See the documentation](https://tinypng.com/developers/reference#resizing-images)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    method: {
      propDefinition: [
        tinypng,
        "method",
      ],
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async additionalProps() {
    const props = {};
    props.width = {
      type: "integer",
      label: "Width",
      description: "The width to resize the image to (in pixels).",
      optional: this.method === "scale",
    };
    props.height = {
      type: "integer",
      label: "Height",
      description: "The height to resize the image to (in pixels).",
      optional: this.method === "scale",
    };
    return props;
  },
  async run({ $ }) {
    if ((this.method === "scale") && (!this.width && !this.height)) {
      throw new ConfigurationError("You must provide either **Height** or **Width**");
    }

    const {
      headers, data,
    } = await this.tinypng.manipulateImage({
      $,
      imageId: this.imageId,
      data: {
        resize: {
          method: this.method,
          width: this.width,
          height: this.height,
        },
      },
      responseType: "stream",
      returnFullResponse: true,
    });

    const ext = headers["content-type"].split("/").pop();

    const filePath = `/tmp/resized-image-${Date.parse(new Date())}.${ext}`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(data, fs.createWriteStream(filePath));

    $.export("$summary", `Image ${filePath} was successfully resized.`);
    return {
      filePath,
    };
  },
};
