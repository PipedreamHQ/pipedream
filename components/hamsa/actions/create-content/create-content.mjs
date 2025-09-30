import { AI_PARTS_OPTIONS } from "../../common/constants.mjs";
import hamsa from "../../hamsa.app.mjs";

export default {
  key: "hamsa-create-content",
  name: "Create AI Content",
  description: "Transform transcribed content into various formats for content marketing. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/post-ai-content)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hamsa,
    jobId: {
      propDefinition: [
        hamsa,
        "jobId",
      ],
    },
    aiParts: {
      type: "string[]",
      label: "AI Parts",
      description: "Parts for AI content in marketing.",
      options: AI_PARTS_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.hamsa.createAIContent({
      $,
      params: {
        jobId: this.jobId,
      },
      data: {
        aiParts: this.aiParts,
      },
    });

    $.export("$summary", `AI content creation job created with ID: ${response.data.id}`);

    return response;
  },
};
