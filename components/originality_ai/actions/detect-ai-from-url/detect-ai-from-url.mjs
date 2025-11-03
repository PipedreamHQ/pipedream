import app from "../../originality_ai.app.mjs";

export default {
  key: "originality_ai-detect-ai-from-url",
  name: "Detect AI From URL",
  description: "Scans a webpage for AI generated content. [See the documentation](https://docs.originality.ai/api-v1-0-reference/scan/ai-url-scan)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.scanWebpageForAI({
      $,
      data: {
        url: this.url,
      },
    });

    $.export("$summary", "Successfully scanned URL for AI");
    return response;
  },
};
