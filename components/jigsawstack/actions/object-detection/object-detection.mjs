import jigsawstack from "../../jigsawstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "jigsawstack-object-detection",
  name: "Object Detection",
  description: "Recognize objects within a provided image and retrieve it with great accuracy. [See the documentation](https://docs.jigsawstack.com/api-reference/ai/object-detection)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jigsawstack,
    imageUrl: {
      propDefinition: [
        jigsawstack,
        "imageUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jigsawstack.detectObjectsInImage({
      imageUrl: this.imageUrl,
    });
    $.export("$summary", "Successfully detected objects in the image");
    return response;
  },
};
