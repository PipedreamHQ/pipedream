import weglot from "../../weglot.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "weglot-translate-text",
  name: "Translate Text",
  description: "Translate text using Weglot. [See the documentation](https://developers.weglot.com/api/reference#translate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    weglot,
    fromLanguage: {
      propDefinition: [
        weglot,
        "language",
      ],
      label: "From Language",
    },
    toLanguage: {
      propDefinition: [
        weglot,
        "language",
      ],
      label: "To Language",
    },
    words: {
      type: "string[]",
      label: "Words",
      description: "Sentences to translate",
    },
    requestUrl: {
      type: "string",
      label: "Request URL",
      description: "URL where the request comes from",
    },
    wordType: {
      type: "integer",
      label: "Word Type",
      description: "Used to provide context over where the text we wish to translate comes from. Any general text node is of WordType `1`.",
      default: 1,
      options: constants.WORD_TYPES,
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the page where the sentences come from",
      optional: true,
    },
  },
  async run({ $ }) {
    const words = this.words.map((word) => ({
      w: word,
      t: this.wordType,
    }));

    const response = await this.weglot.translateText({
      data: {
        l_from: this.fromLanguage,
        l_to: this.toLanguage,
        words,
        request_url: this.requestUrl,
        title: this.title,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully translated text.");
    }

    return response;
  },
};
