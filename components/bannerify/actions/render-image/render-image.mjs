import bannerify from "../../bannerify.app.mjs";

export default {
  key: "bannerify-render-image",
  name: "Render Image",
  description: "Generate an image from a Bannerify template and return a hosted file URL. [See the documentation](https://bannerify.co/docs/integrations/pipedream)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bannerify,
    templateId: {
      propDefinition: [
        bannerify,
        "templateId",
      ],
    },
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
    modifications: {
      propDefinition: [
        bannerify,
        "modifications",
      ],
    },
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
