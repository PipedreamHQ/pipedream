import { getUrlOrFile } from "../../common/utils.mjs";
import deepimage from "../../deepimage.app.mjs";

export default {
  key: "deepimage-auto-enhance",
  name: "Auto Enhance Image",
  description: "Improves the provided image. [See the documentation](https://documentation.deep-image.ai/image-processing/auto-enhance)",
  version: "0.0.1",
  type: "action",
  props: {
    deepimage,
    image: {
      propDefinition: [
        deepimage,
        "image",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.makeRequest({
      data: {
        url: getUrlOrFile(this.image),
        preset: "auto_enhance",
      },
    });

    $.export("$summary", "Successfully enhanced the image.");
    return response;
  },
};
