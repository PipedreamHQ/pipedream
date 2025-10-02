import intellexer from "../../intellexer_api.app.mjs";

export default {
  key: "intellexer_api-detect-language",
  name: "Detect Language",
  description: "Recognize language and encoding of an input text stream. [See the documentation](http://esapi.intellexer.com/Home/Help)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intellexer,
    text: {
      type: "string",
      label: "Text Body",
      description: "The text to analyze",
    },
  },
  async run({ $ }) {
    const response = await this.intellexer.recognizeLanguage({
      data: this.text,
      $,
    });

    if (response) {
      $.export("$summary", "Successfully detected language(s).");
    }

    return response;
  },
};
