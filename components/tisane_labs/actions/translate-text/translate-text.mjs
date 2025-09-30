import tisaneLabs from "../../tisane_labs.app.mjs";

export default {
  key: "tisane_labs-translate-text",
  name: "Translate Text",
  description: "Translate text between supported languages. [See the documentation](https://docs.tisane.ai/#3255e226-db15-4a30-bf88-1e2d74366a17)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tisaneLabs,
    from: {
      propDefinition: [
        tisaneLabs,
        "language",
      ],
      label: "From",
      description: "The source language",
    },
    to: {
      propDefinition: [
        tisaneLabs,
        "language",
      ],
      label: "To",
      description: "The target language",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content to translate",
    },
  },
  async run({ $ }) {
    const response = await this.tisaneLabs.translateText({
      data: {
        from: this.from,
        to: this.to,
        content: this.content,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully translated text.");
    }

    return response;
  },
};
