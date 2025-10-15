import app from "../../textcortex.app.mjs";

export default {
  key: "textcortex-translate-text",
  name: "Translate Text",
  description: "Translate given text into another language. [See the documentation](https://docs.textcortex.com/api/paths/texts-translations/post)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    sourceLang: {
      description: "The language of the text to translate.",
      propDefinition: [
        app,
        "sourceLang",
      ],
    },
    targetLang: {
      description: "The language to translate to.",
      optional: false,
      propDefinition: [
        app,
        "targetLang",
      ],
    },
  },
  methods: {
    translateText(args = {}) {
      return this.app.post({
        path: "/texts/translations",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      translateText,
      text,
      sourceLang,
      targetLang,
    } = this;

    const response = await translateText({
      step,
      data: {
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
      },
    });

    step.export("$summary", `Successfully translated text from ${sourceLang} to ${targetLang}.`);

    return response;
  },
};
