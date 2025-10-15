import tisaneLabs from "../../tisane_labs.app.mjs";

export default {
  key: "tisane_labs-analyze-text",
  name: "Analyze Text",
  description: "Analyze text for language, entities, sentiment, and other insights. [See the documentation](https://docs.tisane.ai/#561264c5-6dbe-4bde-aba3-7defe837989f)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tisaneLabs,
    language: {
      propDefinition: [
        tisaneLabs,
        "language",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content to analyze",
    },
    format: {
      propDefinition: [
        tisaneLabs,
        "format",
      ],
    },
    disableSpellcheck: {
      type: "boolean",
      label: "Disable Spellcheck",
      description: "Determines whether the automatic spellchecking is to be disabled. Default: `false`",
      default: false,
      optional: true,
    },
    lowercaseSpellcheckOnly: {
      type: "boolean",
      label: "Lowercase Spellcheck Only",
      description: "Determines whether the automatic spellchecking is only to be applied to words in lowercase. Default: `false`",
      default: false,
      optional: true,
    },
    minGenericFrequency: {
      type: "integer",
      label: "Minimum Generic Frequency",
      description: "Allows excluding more esoteric terms; The valid values are 0 thru 10.",
      min: 0,
      max: 10,
      optional: true,
    },
    subscope: {
      type: "boolean",
      label: "Subscope",
      description: "Enables sub-scope parsing, for scenarios like hashtag, URL parsing, and obfuscated content (e.g. ihateyou). Default: `false`",
      default: false,
      optional: true,
    },
    abuse: {
      type: "boolean",
      label: "Abuse",
      description: "Output instances of abusive conten. Default: `true`",
      default: true,
      optional: true,
    },
    sentiment: {
      type: "boolean",
      label: "Sentiment",
      description: "Output sentiment-bearing snippets. Default: `true`",
      default: true,
      optional: true,
    },
    documentSentiment: {
      type: "boolean",
      label: "Document Sentiment",
      description: "output document-level sentiment. Default: `false`",
      default: false,
      optional: true,
    },
    entities: {
      type: "boolean",
      label: "Entities",
      description: "Output entities. Default: `true`",
      default: true,
      optional: true,
    },
    topics: {
      type: "boolean",
      label: "Topics",
      description: "Output topics. Default: `true`",
      default: true,
      optional: true,
    },
    words: {
      type: "boolean",
      label: "Words",
      description: "Output the lexical chunks / words for every sentence. Default: `false`",
      default: false,
      optional: true,
    },
    fetchDefinitions: {
      type: "boolean",
      label: "Fetch Definitions",
      description: "Include definitions of the words in the output. Only relevant when the `words` setting is `true`. Default: `false",
      default: false,
      optional: true,
    },
    parses: {
      type: "boolean",
      label: "Parse",
      description: "Output parse forests of phrases",
      optional: true,
    },
    deterministic: {
      type: "boolean",
      label: "Deterministic",
      description: "Whether the n-best senses and n-best parses are to be output in addition to the detected sense. If `true`, only the detected sense will be output. Default: `true`",
      default: true,
      optional: true,
    },
    snippets: {
      type: "boolean",
      label: "Snippets",
      description: "Include the text snippets in the abuse, sentiment, and entities sections. Default: `false`",
      default: false,
      optional: true,
    },
    explain: {
      type: "boolean",
      label: "Explain",
      description: "If `true`, a reasoning for the abuse and sentiment snippets is provided when possible",
      optional: true,
    },
    featureStandard: {
      propDefinition: [
        tisaneLabs,
        "featureStandard",
      ],
    },
    topicStandard: {
      propDefinition: [
        tisaneLabs,
        "topicStandard",
      ],
    },
    sentimentAnalysisType: {
      propDefinition: [
        tisaneLabs,
        "sentimentAnalysisType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tisaneLabs.analyzeText({
      data: {
        language: this.language,
        content: this.content,
        settings: {
          format: this.format,
          disable_spellcheck: this.disableSpellcheck,
          lowercase_spellcheck_only: this.lowercaseSpellcheckOnly,
          min_generic_frequency: this.minGenericFrequency,
          subscope: this.subscope,
          abusse: this.abuse,
          sentiment: this.sentiment,
          document_sentiment: this.documentSentiment,
          entities: this.entities,
          topics: this.topics,
          words: this.words,
          fetch_definitions: this.fetchDefinitions,
          parses: this.parses,
          deterministic: this.deterministic,
          snippets: this.snippets,
          explain: this.explain,
          feature_standard: this.featureStandard,
          topic_standard: this.topicStandard,
          sentiment_analysis_type: this.sentimentAnalysisType,
        },
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully analyzed text.");
    }

    return response;
  },
};
