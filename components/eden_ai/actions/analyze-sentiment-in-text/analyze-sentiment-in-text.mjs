import app from "../../eden_ai.app.mjs";

export default {
  key: "eden_ai-analyze-sentiment-in-text",
  name: "Analyze Sentiment in Text",
  description: "Analyzes sentiment in the provided text. [See the documentation](https://docs.edenai.co/reference/text_sentiment_analysis_create)",
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
        providers: providers.join(),
        fallback_providers: fallbackProviders?.join(),
        show_original_response: showOriginalResponse,
        language,
      },
    };

    const response = await this.app.analyzeSentimentInText(params);
    $.export("$summary", "Sentiment analysis successfully performed");
    return response;
  },
};
