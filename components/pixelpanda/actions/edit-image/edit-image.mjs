import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-edit-image",
  name: "Edit Image With AI",
  description: "Change an image with a text instruction using FLUX Kontext. 2 credits. [See the documentation](https://pixelpanda.ai/developers)",
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
    prompt: {
      type: "string",
      label: "Prompt",
      description: "What to change, e.g. `make the car yellow`",
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.editImage({
      $,
      data: {
        image_url: this.imageUrl,
        prompt: this.prompt,
      },
    });

    $.export("$summary", "Successfully edited image");

    return response;
  },
};
