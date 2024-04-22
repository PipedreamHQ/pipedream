import tinypng from "../../tinypng.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tinypng-resize-image",
  name: "Resize Image",
  description: "Create resized versions of your uploaded image. [See the documentation](https://tinypng.com/developers)",
  version: "0.0.1",
  type: "action",
  props: {
    tinypng,
    outputUrl: tinypng.propDefinitions.outputUrl,
    resizeMethod: tinypng.propDefinitions.resizeMethod,
    width: tinypng.propDefinitions.width,
    height: tinypng.propDefinitions.height,
  },
  async run({ $ }) {
    const response = await this.tinypng.resizeImage({
      outputUrl: this.outputUrl,
      resizeMethod: this.resizeMethod,
      width: this.width,
      height: this.height,
    });
    $.export("$summary", `Image resized successfully. New dimensions are ${this.width}x${this.height}.`);
    return response;
  },
};
