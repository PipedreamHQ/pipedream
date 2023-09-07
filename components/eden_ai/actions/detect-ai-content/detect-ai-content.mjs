import app from "../../eden_ai.app.mjs";

export default {
  key: "eden_ai-detect-ai-content",
  name: "Detect AI Content",
  description:
    "Detects AI content in the provided text. [See the documentation](https://docs.edenai.co/reference/text_ai_detection_create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
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
    language: {
      propDefinition: [
        app,
        "language",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      text,
      providers,
      fallbackProviders,
      showOriginalResponse,
      language,
    } = this;

    const params = {
      $,
      data: {
        text,
        providers,
        fallback_providers: fallbackProviders,
        show_original_response: showOriginalResponse,
        language,
      },
    };

    const response = await this.detectAIContent(params);
    $.export("$summary", "AI content detection completed successfully");
    return response;
  },
};
