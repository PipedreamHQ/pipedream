import app from "../../microsoft_azure_ai_translator.app.mjs";

export default {
  key: "microsoft_azure_ai_translator-detect-language",
  name: "Detect Language",
  description: "Identifies the language of a piece of text. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-detect)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.detectLanguage({
      $,
      data: [
        {
          text: this.text,
        },
      ],
    });
    $.export("$summary", `Successfully detected language of the provided text: '${response.language}'s`);
    return response;
  },
};
