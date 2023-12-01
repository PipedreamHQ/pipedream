import alttext_ai from "../../alttext_ai.app.mjs";

export default {
  key: "alttext_ai-generate-alt-text",
  name: "Generate Alt Text",
  description: "Generates a descriptive alt text for a given image. Optionally specify the language for the alt text. [See the documentation](https://api.alttext.org/v1/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    alttext_ai,
    imageData: {
      propDefinition: [
        alttext_ai,
        "imageData",
      ],
    },
    language: {
      propDefinition: [
        alttext_ai,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const altTextResult = await this.alttext_ai.generateAltText({
      imageData: this.imageData,
      language: this.language,
    });

    $.export("$summary", `Generated alt text successfully: ${altTextResult.alt_text}`);
    return altTextResult;
  },
};
