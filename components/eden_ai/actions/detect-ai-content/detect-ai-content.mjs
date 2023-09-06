import app from "../../eden_ai.app.mjs";

export default {
  key: "eden_ai-detect-ai-content",
  name: "Detect AI Content",
  description:
    "Detects AI content in text. [See the documentation](https://docs.edenai.co/reference/text_ai_detection_create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The text to analyze.",
    },
    providers: {
      propDefinition: [
        app,
        "providers",
      ],
    },
    fallbackProviders: {
      propDefinition: [
        app,
        "fallbackProviders",
      ],
    },
    showOriginalResponse: {
      propDefinition: [
        app,
        "showOriginalResponse",
      ],
    },
    sourceLanguage: {
      propDefinition: [
        app,
        "language",
      ],
      label: "Source Language",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      text,
      providers,
      fallbackProviders,
      showOriginalResponse,
      sourceLanguage,
    } = this;

    const params = {
      $,
      data: {
        text,
        providers,
        fallback_providers: fallbackProviders,
        show_original_response: showOriginalResponse,
        language: sourceLanguage,
      },
    };

    const response = await this.detectAIContent(params);
    $.export("$summary", "AI content detection completed successfully");
    return response;
  },
};
