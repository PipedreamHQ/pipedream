import bannerify from "../../bannerify.app.mjs";

export default {
  key: "bannerify-render-image",
  name: "Render Image",
  description: "Generate an image from a Bannerify template and return a hosted file URL. [See the documentation](https://docs.bannerify.co/api-reference/endpoint/create-stored-image)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bannerify,
    templateId: bannerify.propDefinitions.templateId,
    format: {
      type: "string",
      label: "Format",
      description: "The output image format.",
      options: [
        "png",
        "jpeg",
        "webp",
      ],
      default: "png",
    },
    modifications: bannerify.propDefinitions.modifications,
  },
  async run({ $ }) {
    const response = await this.bannerify.renderStoredImage({
      $,
      templateId: this.templateId,
      format: this.format,
      modifications: this.modifications,
    });

    $.export("$summary", `Successfully generated image: ${response.url}`);

    return response;
  },
};
