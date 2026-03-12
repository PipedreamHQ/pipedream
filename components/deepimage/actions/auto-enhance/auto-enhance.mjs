import { getUrlOrFile } from "../../common/utils.mjs";
import deepimage from "../../deepimage.app.mjs";

export default {
  key: "deepimage-auto-enhance",
  name: "Auto Enhance Image",
  description: "Improves the provided image. [See the documentation](https://documentation.deep-image.ai/image-processing/auto-enhance)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deepimage,
    image: {
      propDefinition: [
        deepimage,
        "image",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.makeRequest({
      data: {
        url: await getUrlOrFile(this.image),
        preset: "auto_enhance",
      },
    });

    $.export("$summary", "Successfully enhanced the image.");
    return response;
  },
};
