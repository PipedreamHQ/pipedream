import app from "../../eden_ai.app.mjs";

const options = [
  "amazon",
  "connexun",
  "google",
  "ibm",
  "lettria",
  "microsoft",
  "emvista",
  "oneai",
  "openai",
  "tenstorrent",
  "sapling",
];

export default {
  key: "eden_ai-analyze-sentiment-in-text",
  name: "Analyze Sentiment in Text",
  description: "Analyzes sentiment in the provided text. [See the documentation](https://docs.edenai.co/reference/text_sentiment_analysis_create)",
  version: "0.0.4",
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
    providers: {
      propDefinition: [
        app,
        "providers",
      ],
      options,
    },
    fallbackProviders: {
      propDefinition: [
        app,
        "fallbackProviders",
      ],
      options,
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
