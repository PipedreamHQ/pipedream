import codeqNaturalLanguageProcessingApi from "../../codeq_natural_language_processing_api.app.mjs";

export default {
  key: "codeq_natural_language_processing_api-check-similarity",
  name: "Check Similarity",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Receives two texts and returns a JSON object containing the text similarity score. [See the docs here](https://api.codeq.com/api)",
  type: "action",
  props: {
    codeqNaturalLanguageProcessingApi,
    text1: {
      type: "string",
      label: "Text 1",
      description: "The first document to be compared.",
    },
    text2: {
      type: "string",
      label: "Text 2",
      description: "The second document to be compared.",
    },
  },
  async run({ $ }) {
    const {
      codeqNaturalLanguageProcessingApi,
      ...data
    } = this;

    const response = await codeqNaturalLanguageProcessingApi.textSimilarity({
      $,
      data,
    });

    $.export("$summary", "The text similarity was successfully checked!");
    return response;
  },
};
