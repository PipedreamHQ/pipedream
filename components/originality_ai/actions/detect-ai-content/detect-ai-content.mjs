import originality_ai from "../../originality_ai.app.mjs";

export default {
  key: "originality_ai-detect-ai-content",
  name: "Detect AI Content",
  description: "Scans a string for AI content. [See the documentation]()",
  version: "0.0.1",
  type: "action",
  props: {
    originality_ai,
    content: {
      propDefinition: [
        originality_ai,
        "content",
      ],
    },
    aimodelversion: {
      propDefinition: [
        originality_ai,
        "aimodelversion",
      ],
    },
    storescan: {
      propDefinition: [
        originality_ai,
        "storescan",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.originality_ai.scanStringForAI({
      data: {
        content: this.content,
        aimodelversion: this.aimodelversion,
        storescan: this.storescan,
      },
    });
    $.export("$summary", "Successfully scanned content for AI");
    return response;
  },
};
