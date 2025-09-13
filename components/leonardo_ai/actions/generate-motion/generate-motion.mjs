import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-generate-motion",
  name: "Generate Motion",
  description: "Generates a motion (video) from the provided image using Leonardo AI's SVD Motion Generation API.",
  version: "0.0.4",
  type: "action",
  props: {
    app,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The ID of the image to generate motion from. This should be a previously generated or uploaded image ID.",
    },
    motionStrength: {
      type: "integer",
      label: "Motion Strength",
      description: "The motion strength for the video generation.",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether the generation is public or not.",
      optional: true,
    },
    isInitImage: {
      type: "boolean",
      label: "Is Init Image",
      description: "If it is an init image uploaded by the user.",
      optional: true,
    },
    isVariation: {
      type: "boolean",
      label: "Is Variation",
      description: "If it is a variation image.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      imageId,
      motionStrength,
      isPublic,
      isInitImage,
      isVariation,
    } = this;

    const data = {
      imageId,
    };

    if (motionStrength !== undefined) {
      data.motionStrength = motionStrength;
    }
    if (isPublic !== undefined) {
      data.isPublic = isPublic;
    }
    if (isInitImage !== undefined) {
      data.isInitImage = isInitImage;
    }
    if (isVariation !== undefined) {
      data.isVariation = isVariation;
    }

    const response = await this.app.post({
      $,
      path: "/generations-motion-svd",
      data,
    });

    $.export("$summary", `Successfully generated motion from image ID: ${imageId}`);
    return response;
  },
};
