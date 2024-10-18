import deepimage from "../../deepimage.app.mjs";

export default {
  key: "deepimage-remove-background",
  name: "Remove Background",
  description: "Removes the background from the provided image using DeepImage. [See the documentation](https://documentation.deep-image.ai/quick-start)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deepimage,
    image: {
      propDefinition: [
        deepimage,
        "image",
      ],
    },
    backgroundColor: {
      propDefinition: [
        deepimage,
        "backgroundColor",
      ],
    },
    cropType: {
      propDefinition: [
        deepimage,
        "cropType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.removeBackground({
      image: this.image,
      backgroundColor: this.backgroundColor,
      cropType: this.cropType,
    });

    $.export("$summary", "Background removal successful");
    return response;
  },
};
