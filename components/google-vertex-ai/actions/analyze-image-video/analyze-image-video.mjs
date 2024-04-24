import vertexAi from "../../vertex-ai.app.mjs";

export default {
  key: "google-vertex-ai-analyze-image-video",
  name: "Analyze Image/Video",
  description: "Examines input images and videos following given instructions. Results will contain the analysis findings. [See the documentation](https://cloud.google.com/vertex-ai/docs/reference/rest)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vertexAi,
    resource: {
      propDefinition: [
        vertexAi,
        "resource",
      ],
    },
    instructions: {
      propDefinition: [
        vertexAi,
        "instructions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vertexAi.analyzeResource({
      resource: this.resource,
      instructions: this.instructions,
    });
    $.export("$summary", "Successfully analyzed resource");
    return response;
  },
};
