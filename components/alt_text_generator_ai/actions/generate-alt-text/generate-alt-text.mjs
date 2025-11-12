import altTextGeneratorAi from "../../alt_text_generator_ai.app.mjs";

export default {
  key: "alt_text_generator_ai-generate-alt-text",
  name: "Generate Alt Text",
  description: "Generate alt text for an image. [See the documentation](https://alttextgeneratorai.com/api-docs)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    altTextGeneratorAi,
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to generate alt text for",
    },
  },
  async run({ $ }) {
    const response = await this.altTextGeneratorAi.generateAltText({
      $,
      data: {
        image: this.image,
      },
    });
    $.export("$summary", `Successfully generated alt text for ${this.image}`);
    return response;
  },
};
