import app from "../../one_ai.app.mjs";

export default {
  name: "Find Text in Clusters",
  description: "Find clusters with a similar meaning of a given text.  [See the documentation](https://docs.oneai.com/docs/find-text).",
  key: "one_ai-find-text-in-clusters",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    collection: {
      propDefinition: [
        app,
        "collection",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Search Text",
    },
    multilingual: {
      type: "boolean",
      label: "Multilingual",
      description: "True if text is not in english",
      optional: true,
    },
    translate: {
      type: "boolean",
      label: "Translate",
      description: "Translate to English",
      optional: true,
    },
    similarityThreshold: {
      type: "string",
      label: "Similarity Threshold",
      description: "Minimum similarity of results (between 0 and 1)",
      optional: true,
    },
    expectedLanguage: {
      type: "string",
      label: "Expected Language",
      description: "Expected language of text",
      optional: true,
    },
    overrideLanguageDetection: {
      type: "boolean",
      label: "Override Language Detection",
      description: "Whether to override language detection",
      optional: true,
    },
  },
  async run({ $ }) {
    const res = await this.app.findTextInClusters(this.collection, {
      "text": this.text,
      "multilingual": this.multilingual,
      "translate": this.translate,
      "similarity_threshold": this.similarityThreshold,
      "expected-language": this.expectedLanguage,
      "override-language-detection": this.overrideLanguageDetection,
    });
    $.export("summary", `Successfully found ${res.length} cluster(s)`);
    return res;
  },
};
