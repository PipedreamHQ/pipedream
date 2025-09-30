import app from "../../originality_ai.app.mjs";

export default {
  key: "originality_ai-detect-ai-content",
  name: "Detect AI Content",
  description: "Scans a string for AI content. [See the documentation](https://docs.originality.ai/api-v1-0-reference/scan/ai-scan)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    aiModelVersion: {
      propDefinition: [
        app,
        "aiModelVersion",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    storeScan: {
      propDefinition: [
        app,
        "storeScan",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.scanStringForAI({
      $,
      data: {
        content: this.content,
        aiModelVersion: this.aiModelVersion,
        title: this.title,
        storeScan: this.storeScan === false
          ? "false"
          : undefined,
      },
    });
    $.export("$summary", "Successfully scanned content for AI");
    return response;
  },
};
