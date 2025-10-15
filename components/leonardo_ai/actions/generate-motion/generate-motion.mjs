import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-generate-motion",
  name: "Generate Motion",
  description: "Generates a motion (video) from the provided image using Leonardo AI's SVD Motion Generation API. [See the documentation](https://docs.leonardo.ai/reference/createsvdmotiongeneration)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The ID of the image to generate motion from. You can either select from previously generated images or manually enter the ID of an uploaded image.",
      async options({ prevContext }) {
        // Get user info to retrieve userId
        const userInfo = await this.app.getUserInfo({
          $: this,
        });
        // Extract userId from the response structure
        const userId = userInfo.user_details?.[0]?.user?.id || userInfo.id;

        // Get generations with pagination
        const offset = prevContext?.offset || 0;
        const limit = 20;

        const generations = await this.app.getGenerationsByUserId({
          $: this,
          userId,
          offset,
          limit,
        });

        // Extract image IDs from generated_images array
        const options = [];
        if (generations.generations) {
          for (const generation of generations.generations) {
            if (generation.generated_images) {
              for (const image of generation.generated_images) {
                options.push({
                  label: `Image ${image.id} (Generation ${generation.id})`,
                  value: image.id,
                });
              }
            }
          }
        }

        // Check if there are more pages
        const hasMore = generations.generations && generations.generations.length === limit;
        const nextOffset = hasMore
          ? offset + limit
          : null;

        return {
          options,
          context: nextOffset
            ? {
              offset: nextOffset,
            }
            : {},
        };
      },
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
      description: "Whether the image being used is an init image uploaded by the user.",
      optional: true,
    },
    isVariation: {
      type: "boolean",
      label: "Is Variation",
      description: "Whether the image being used is a variation image.",
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
      motionStrength,
      isPublic,
      isInitImage,
      isVariation,
    };

    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/generations-motion-svd",
      data,
    });

    $.export("$summary", `Successfully generated motion from image ID: ${imageId}`);
    return response;
  },
};
