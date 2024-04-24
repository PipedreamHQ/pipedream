import vertexAi from "../../vertex-ai.app.mjs";

export default {
  key: "google-vertex-ai-analyze-text-sentiment",
  name: "Analyze Text Sentiment",
  description: "Analyzes a specified text for its underlying sentiment. [See the documentation](https://cloud.google.com/vertex-ai/docs/reference/rest)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vertexAi,
    text: {
      type: "string",
      label: "Text",
      description: "The content to analyze for sentiment",
    },
  },
  async run({ $ }) {
    const response = await this.vertexAi.analyzeSentiment({
      text: this.text,
    });
    $.export("$summary", "Successfully analyzed text sentiment");
    return response;
  },
};
