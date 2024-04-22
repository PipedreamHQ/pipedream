import tinypng from "../../tinypng.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tinypng-convert-image",
  name: "Convert Image",
  description: "Convert your images to your desired image type using TinyPNG. [See the documentation](https://tinypng.com/developers/reference)",
  version: "0.0.1",
  type: "action",
  props: {
    tinypng,
    url: tinypng.propDefinitions.url,
    file: tinypng.propDefinitions.file,
    convert: tinypng.propDefinitions.convert,
    transformBackground: tinypng.propDefinitions.transformBackground,
  },
  async run({ $ }) {
    if ((this.url && this.file) || (!this.url && !this.file)) {
      throw new Error("Please provide either an Image URL or an Image File, not both.");
    }

    const compressResponse = await this.tinypng.compressImage({
      url: this.url,
      file: this.file,
    });

    const { output: { url: outputUrl } = {} } = compressResponse;

    if (!outputUrl) {
      throw new Error("Failed to obtain the output URL from the compression step.");
    }

    const convertResponse = await this.tinypng.convertImage({
      outputUrl,
      convert: this.convert,
      transformBackground: this.transformBackground,
    });

    $.export("$summary", `Successfully converted the image to ${this.convert}`);

    return convertResponse;
  },
};
