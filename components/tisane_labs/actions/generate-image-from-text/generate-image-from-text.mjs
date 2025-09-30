import tisaneLabs from "../../tisane_labs.app.mjs";

export default {
  key: "tisane_labs-generate-image-from-text",
  name: "Generate Image From Text",
  description: "Finds and returns a URL of an image (Creative Commons) best describing the text. [See the documentation](https://docs.tisane.ai/#b61cf454-1e78-42c4-a239-7fa580781729)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tisaneLabs,
    language: {
      propDefinition: [
        tisaneLabs,
        "language",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content to analyze",
    },
  },
  async run({ $ }) {
    const response = await this.tisaneLabs.generateImageFromText({
      data: {
        language: this.language,
        content: this.content,
      },
      $,
    });

    if (response.length) {
      $.export("$summary", "Successfully generated image from text.");
    }

    return response;
  },
};
