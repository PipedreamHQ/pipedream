import tinypng from "../../tinypng.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tinypng-compress-image",
  name: "Compress Image",
  description: "Compress a WebP, JPEG, or PNG image using the TinyPNG API. [See the documentation](https://tinypng.com/developers/reference)",
  version: "0.0.1",
  type: "action",
  props: {
    tinypng,
    url: {
      propDefinition: [
        tinypng,
        "url",
      ],
    },
    file: {
      propDefinition: [
        tinypng,
        "file",
      ],
    },
    resizeMethod: {
      propDefinition: [
        tinypng,
        "resizeMethod",
      ],
    },
    width: {
      propDefinition: [
        tinypng,
        "width",
      ],
    },
    height: {
      propDefinition: [
        tinypng,
        "height",
      ],
    },
    convert: {
      propDefinition: [
        tinypng,
        "convert",
      ],
    },
    transformBackground: {
      propDefinition: [
        tinypng,
        "transformBackground",
      ],
    },
  },
  async run({ $ }) {
    let response;
    if (this.url || this.file) {
      response = await this.tinypng.compressImage({
        url: this.url,
        file: this.file,
      });
    } else {
      throw new Error("You must provide either a URL or a file for compression.");
    }

    // Check if resizing parameters are provided
    if (this.resizeMethod && this.width && this.height) {
      response = await this.tinypng.resizeImage({
        outputUrl: response.output.url,
        resizeMethod: this.resizeMethod,
        width: this.width,
        height: this.height,
      });
    }

    // Check if conversion parameters are provided
    if (this.convert) {
      response = await this.tinypng.convertImage({
        outputUrl: response.output.url,
        convert: this.convert,
        transformBackground: this.transformBackground,
      });
    }

    $.export("$summary", "Image processed successfully.");
    return response;
  },
};
