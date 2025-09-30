import app from "../../translate_com.app.mjs";

export default {
  name: "Translate Text",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "translate_com-translate-text",
  description: "Translante a text using machine. [See the documentation](https://translation-api.translate.com/api/documentation?_gl=1*1qes1da*_ga*MTMwNzkzMTg3OC4xNjk1NDE3MDIy*_ga_T51KL347BB*MTY5NTQxNzAyMS4xLjAuMTY5NTQxNzAyMS42MC4wLjA.#/Machine Translation)",
  type: "action",
  props: {
    app,
    sourceLanguage: {
      label: "Source language",
      description: "The language of the source text",
      propDefinition: [
        app,
        "language",
      ],
    },
    translationLanguage: {
      type: "string",
      label: "Translation language",
      description: "The translation language",
      propDefinition: [
        app,
        "language",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text to be translated",
    },
  },
  async run({ $ }) {
    const response = await this.app.translateText({
      $,
      data: {
        source_language: this.sourceLanguage,
        translation_language: this.translationLanguage,
        text: this.text,
      },
    });

    if (response) {
      $.export("$summary", "Successfully translated text");
    }

    return response;
  },
};
