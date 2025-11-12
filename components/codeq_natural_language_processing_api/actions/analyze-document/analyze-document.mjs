import codeqNaturalLanguageProcessingApi from "../../codeq_natural_language_processing_api.app.mjs";

export default {
  key: "codeq_natural_language_processing_api-analyze-document",
  name: "Analyze Document",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Receives a text and returns a JSON object containing a list of analyzed sentences. [See the docs here](https://api.codeq.com/api)",
  type: "action",
  props: {
    codeqNaturalLanguageProcessingApi,
    sentences: {
      type: "string[]",
      label: "Sentences",
      description: "A list of strings to be analyzed.",
    },
    pipeline: {
      type: "string[]",
      label: "Pipeline",
      description: "A list of strings indicating the specific NLP annotators to apply.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      codeqNaturalLanguageProcessingApi,
      sentences,
      pipeline,
    } = this;

    const response = await codeqNaturalLanguageProcessingApi.analyzeText({
      $,
      data: {
        sentences,
        pipeline: pipeline && pipeline.toString(),
      },
    });

    $.export("$summary", "The text was successfully analyzed!");
    return response;
  },
};
