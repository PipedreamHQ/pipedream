import originality_ai from "../../originality_ai.app.mjs";

export default {
  key: "originality_ai-detect-ai-from-url",
  name: "Detect AI From URL",
  description: "Scans a webpage for AI generated content. [See the documentation](https://docs.originality.ai/api-v1-0-reference/scan/ai-url-scan)",
  version: "0.0.1",
  type: "action",
  props: {
    originality_ai,
    url: {
      propDefinition: [
        originality_ai,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.originality_ai.scanWebpageForAI({
      $,
      data: {
        url: this.url,
      },
    });

    $.export("$summary", "Successfully scanned URL for AI");
    return response;
  },
};
