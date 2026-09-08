import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-enhance-photo",
  name: "Enhance Photo",
  description: "Sharpen, de-noise and fix lighting with AI. 1 credit. [See the documentation](https://pixelpanda.ai/developers)",
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
    const response = await this.pixelpanda.enhancePhoto({
      $,
      data: {
        image_url: this.imageUrl,
      },
    });

    $.export("$summary", "Successfully enhanced photo");

    return response;
  },
};
