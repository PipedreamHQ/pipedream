import allImagesAi from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-generate-images-advanced",
  name: "Generate Advanced Customized Images",
  description: "Generates advanced customized images using a prompt from the user. [See the documentation](https://developer.all-images.ai/all-images.ai-api/api-reference/images-generation#create-image-generation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    allImagesAi,
    name: {
      type: "string",
      label: "Name",
      description: "Enter the name for the image generation.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Enter the prompt for the image generation.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags make it easy to find generations.",
      optional: true,
    },
    metaData: {
      type: "object",
      label: "Meta Data",
      description: "Pass on metadata to a ImageGeneration.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.allImagesAi.generateImage({
      $,
      data: {
        name: this.name,
        mode: "advanced",
        prompt: this.prompt,
        tags: this.tags,
        metaData: this.metaData,
      },
    });
    $.export("$summary", `Successfully generated images with the name "${this.name}"`);
    return response;
  },
};

