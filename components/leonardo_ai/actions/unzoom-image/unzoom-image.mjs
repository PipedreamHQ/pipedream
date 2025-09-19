import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-unzoom-image",
  name: "Unzoom Image",
  description: "Creates an unzoom variation for a generated or variation image using Leonardo AI's unzoom API.",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The ID of the image to create an unzoom variation for. This should be a previously generated or variation image ID.",
    },
    isVariation: {
      type: "boolean",
      label: "Is Variation",
      description: "Whether the image is a variation image.",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      imageId,
      isVariation,
    } = this;

    const data = {
      id: imageId,
      isVariation,
    };

    const response = await this.app.post({
      $,
      path: "/variations/unzoom",
      data,
    });

    $.export("$summary", `Successfully created unzoom variation for image ID: ${imageId}`);
    return response;
  },
};
