import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-image-to-prompt",
  name: "Image To AI Prompts",
  description: "Describe an image as ready-to-use AI art prompts for Flux, Midjourney and Stable Diffusion. 1 credit. [See the documentation](https://pixelpanda.ai/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pixelpanda,
    imageUrl: {
      propDefinition: [
        pixelpanda,
        "imageUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.imageToPrompt({
      $,
      data: {
        image_url: this.imageUrl,
      },
    });

    $.export("$summary", "Successfully generated prompts from image");

    return response;
  },
};
