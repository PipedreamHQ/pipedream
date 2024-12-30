import change_photos from "../../change_photos.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "change_photos-transform-image",
  name: "Transform Image",
  description: "Transforms an image with various effects and optimizations. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    change_photos,
    imageUrl: {
      propDefinition: [
        change_photos,
        "imageUrl",
      ],
    },
    effects: {
      propDefinition: [
        change_photos,
        "effects",
      ],
    },
    optimizations: {
      propDefinition: [
        change_photos,
        "optimizations",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.change_photos.transformImage();
    $.export("$summary", "Image transformed successfully");
    return response;
  },
};
