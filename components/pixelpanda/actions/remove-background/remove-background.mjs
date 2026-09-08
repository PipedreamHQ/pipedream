import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-remove-background",
  name: "Remove Background",
  description: "Cut out the subject and return a transparent PNG. 1 credit. [See the documentation](https://pixelpanda.ai/developers)",
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
    const response = await this.pixelpanda.removeBackground({
      $,
      data: {
        image_url: this.imageUrl,
      },
    });

    $.export("$summary", "Successfully removed background");

    return response;
  },
};
