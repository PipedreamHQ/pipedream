import app from "../../microsoft_azure_ai_translator.app.mjs";

export default {
  key: "microsoft_azure_ai_translator-translate-text",
  name: "Translate Text",
  description: "Translate text into the specified language. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-translate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    profanityAction: {
      propDefinition: [
        app,
        "profanityAction",
      ],
    },
    includeAlignment: {
      propDefinition: [
        app,
        "includeAlignment",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.translateText({
      $,
      data: [
        {
          text: this.text,
        },
      ],
      params: {
        from: this.from,
        to: this.to,
        profanityAction: this.profanityAction,
        includeAlignment: this.includeAlignment,
      },
    });
    $.export("$summary", "Successfully translated the provided text");
    return response;
  },
};
