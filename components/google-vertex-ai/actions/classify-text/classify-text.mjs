import vertexAI from "../../vertex_ai.app.mjs";

export default {
  key: "google-vertex-ai-classify-text",
  name: "Classify Text",
  description: "Groups a provided text into predefined categories. [See the documentation](https://cloud.google.com/vertex-ai/docs/reference/rest)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vertexAI,
    text: vertexAI.propDefinitions.text,
  },
  async run({ $ }) {
    const response = await this.vertexAI.classifyText({
      text: this.text,
    });
    $.export("$summary", `Text classified into category: ${response.category}`);
    return response;
  },
};
